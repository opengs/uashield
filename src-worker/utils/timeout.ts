export class Timeout {
  private _interval: number

  get interval (): number {
    return this._interval
  }

  private constructor (interval: number) {
    this._interval = interval
  }

  static zero (): Timeout {
    return Timeout.fromValue(0)
  }

  increase (min: number, max: number, step = 0): Timeout {
    step = step || min
    if (this.interval < min) {
      return Timeout.fromValue(min)
    }
    const newInterval = this.interval + step
    if (newInterval > max) {
      return Timeout.fromValue(max)
    }
    return Timeout.fromValue(newInterval)
  }

  static fromValue (value: number) {
    return new Timeout(value)
  }
}
