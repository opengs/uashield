import { faker } from '@faker-js/faker'
import { EventEmitter } from 'events'
import { NameserverData } from './types'
import { Resolver } from 'dns'
import { Random } from './utils/random'

const EXPECTED_ERR_CODES = ['ETIMEOUT', 'ENOTFOUND']

export class DnsBattalion {
  private readonly eventSource: EventEmitter
  private nameservers: NameserverData[]
  private active = false

  constructor (nameservers: NameserverData[]) {
    this.nameservers = nameservers
    this.eventSource = new EventEmitter()
  }

  stop () {
    this.active = false
    this.eventSource.removeAllListeners()
  }

  async start () {
    this.active = true
    console.log('battalion started')
    while (this.active) {
      try {
        await this.sendTroops()
      } catch (error) {
        console.log('Error:', error)
      }
    }
  }

  on (event: string | symbol, listener: (...args: any[]) => void) {
    this.eventSource.on(event, listener)
  }

  private async sendTroops () {
    const nameserver = this.nameservers[Random.int(this.nameservers.length)]
    const resolver = new Resolver({
      timeout: 10000
    })
    resolver.setServers([
      nameserver.nameserverIp
    ])
    const startTime = new Date().getTime()
    return new Promise((resolve, reject) => {
      const domainForLookup = `${faker.random.word().toLowerCase()}.${nameserver.host}`
      resolver.resolveAny(domainForLookup, (err, addresses) => {
        const lookupSeconds = ((new Date().getTime() - startTime) / 1000).toFixed(2)
        console.log(`Lookup time: ${lookupSeconds} sec. Domain: ${domainForLookup}. NS: ${nameserver.nameserverHost}. Err code:`, err?.code, 'Address:', addresses)
        if (err?.code && DnsBattalion.isSuccessful(err.code)) {
          resolve(err.code)
        } else if (!addresses) {
          reject(err)
        }
        resolve('FOUND')
      })
    })
  }

  private static isSuccessful (code: string): boolean {
    return EXPECTED_ERR_CODES.indexOf(code) !== -1
  }
}