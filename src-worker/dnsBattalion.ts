import { faker } from '@faker-js/faker'
import { EventEmitter } from 'events'
import { NameserverData } from './types'
import { Resolver } from 'dns'
import { Random } from './utils/random'

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
        console.log(error)
      }
    }
  }

  on (event: string | symbol, listener: (...args: any[]) => void) {
    this.eventSource.on(event, listener)
  }

  private async sendTroops () {
    const nameserver = this.nameservers[Random.int(this.nameservers.length)]
    console.log(`use nameserver. host: ${nameserver.nameserverHost}. ip: ${nameserver.nameserverIp}`, new Date())
    const resolver = new Resolver({
      timeout: 10_000
    })
    resolver.setServers([
      nameserver.nameserverIp
    ])
    return new Promise((resolve, reject) => {
      const domainForLookup = `${faker.random.word()}.${nameserver.host}`
      resolver.resolve4(domainForLookup, (err, addresses) => {
        console.log(domainForLookup, nameserver.nameserverHost, err?.code, addresses)
        if (err && ['ETIMEOUT', 'ENOTFOUND'].indexOf(err.code as string) === -1) {
          reject(err)
        }
        resolve(addresses)
      })
    })
  }
}
