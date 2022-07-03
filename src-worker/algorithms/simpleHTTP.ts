import agent, { SuperAgentRequest } from 'superagent'
import { isWebUri } from 'valid-url'

import { getRandomValue } from './utils/randomGenerators'

import CacheableLookup, { CacheInstance } from 'cacheable-lookup'
import QuickLRU from './utils/lru'

import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { GetTarget, PostTarget } from '../external/targetsPool'
import { Proxy, ProxyPool } from '../external/proxyPool'
import { Algorithm, Config, ExecutionResult } from './algorithm'

import { HttpHeadersUtils } from './utils/httpHeadersUtils'
import { sleep } from '../helpers'
import { LookupFunction } from 'net'

export abstract class SimpleHTTP extends Algorithm {
  protected proxyPool: ProxyPool
  private validateStatusFn: () => boolean

  abstract get method(): 'POST' | 'GET'

  private dnsLookup: CacheableLookup

  constructor (config: Config, proxyPool: ProxyPool) {
    super(config)
    this.proxyPool = proxyPool
    this.validateStatusFn = () => true
    this.dnsLookup = new CacheableLookup({
      cache: new QuickLRU({ maxSize: 1000 }) as CacheInstance
    })
  }

  isValid (target: GetTarget | PostTarget): boolean {
    return isWebUri(target.page) !== undefined
  }

  async execute (target: GetTarget | PostTarget, isRunning: () => boolean): Promise<ExecutionResult> {
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

      proxyAgent.on('error', () => {
        try {
          proxyAgent?.destroy()
        } catch {}
      })

      repeats += Math.floor(Math.random() * 32)
    }

    let success = true
    while (success && repeats > 0 && isRunning()) {
      success = await this.makeRequest(target, proxyAgent)
      packetsSend += 1
      repeats -= 1
      if (success) {
        packetsSuccess++
      }
    }

    try {
      proxyAgent?.destroy()
    } catch {}

    return { packetsSend, packetsSuccess, target, packetsNeutral: 0 }
  }

  protected async makeRequest (target: GetTarget | PostTarget, httpAgent: HttpProxyAgent | HttpsProxyAgent | SocksProxyAgent | null) {
    try {
      const headers = HttpHeadersUtils.generateRequestHeaders()
      const requestURL = this.makeRequestURL(target)
      let request = agent(this.method, requestURL)
      if (httpAgent !== null) {
        request = request.agent(httpAgent)
      }
      request = request.ok(this.validateStatusFn)
      request = request.set('Accept', headers.Accept)
      request = request.set('Accept-Language', headers['Accept-Language'])
      request = request.set('User-Agent', headers['User-Agent'])
      request = this.beforeRequest(request, target)

      const response = await request.timeout(this.config.timeout)

      if (this.config.logRequests) {
        const logURL = (typeof target.name === 'string') ? target.name : target.page
        if (this.config.logTimestamp) {
          console.log(`${new Date().toISOString()} | HTTP | ${logURL} | ${response.status}`)
        } else {
          console.log(`HTTP | ${logURL} | ${response.status}`)
        }
      }

      return true
    } catch (e) {
      if (this.config.logRequests) {
        const logURL = (typeof target.name === 'string') ? target.name : target.page
        if (this.config.logTimestamp) {
          console.log(`${new Date().toISOString()} | HTTP | ${logURL} | DOWN OR BLOCKED`)
        } else {
          console.log(`HTTP | ${logURL} | DOWN OR BLOCKED`)
        }
      }
      return false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected beforeRequest (agent: SuperAgentRequest, _target: GetTarget | PostTarget): SuperAgentRequest {
    return agent
  }

  protected makeRequestAgent (page: string, proxy: Proxy) {
    if (proxy.scheme === 'socks4' || proxy.scheme === 'socks5') {
      // throw new Error('Socks4 and socks5 are not implemented')
      return new SocksProxyAgent({
        host: proxy.host,
        hostname: proxy.host,
        port: proxy.port,
        username: proxy.username,
        password: proxy.password
      }, {
        timeout: 4000,
        dnsCache: this.dnsLookup
      })
    }

    const options = {
      host: proxy.host,
      hostname: proxy.host,
      port: proxy.port,
      timeout: 4000,
      auth: undefined as undefined | string,
      lookup: this.dnsLookup.lookup.bind(this.dnsLookup) as LookupFunction
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

  protected makeRequestURL (target: GetTarget | PostTarget): string {
    let url = target.page

    if (Array.isArray(target.randomGenerators)) {
      for (const generator of target.randomGenerators) {
        if (typeof generator.name === 'string') {
          url = url.replace(`%%%${generator.name}%%%`, () => getRandomValue(generator))
        }
      }
    }

    return url
  }
}
