export class ActionsPerMinuteLog {
  public log: Array<{ timestamp: number, count: number }> = []

  private MAX_LOG_SIZE = 60
  private STATISTICS_DELAY = 60
  private lastEntry: { timestamp: number, count: number }

  constructor () {
    const logStartTimestamp = this.getTimestamp() - this.MAX_LOG_SIZE
    this.log = new Array(this.MAX_LOG_SIZE).fill(0).map((_v, i) => { return { timestamp: logStartTimestamp + i, count: 0 } })
    this.lastEntry = { timestamp: this.getTimestamp(), count: 0 }
  }

  add (count: number) {
    const currentTimestamp = this.getTimestamp()
    this.prepareLog(currentTimestamp)
    this.lastEntry.count += count
  }

  set (count: number) {
    const currentTimestamp = this.getTimestamp()
    this.prepareLog(currentTimestamp)
    this.lastEntry.count = count
  }

  private prepareLog (timestamp: number) {
    while (this.lastEntry.timestamp < timestamp) {
      this.log.push(this.lastEntry)
      this.lastEntry = { timestamp: this.lastEntry.timestamp + 1, count: 0 }
      if (this.log.length > this.MAX_LOG_SIZE) {
        this.log.shift()
      }
    }
  }

  private getTimestamp () {
    return Math.floor(Date.now() / 1000 / this.STATISTICS_DELAY)
  }
}

export interface StatisticsState {
  ddos: {
    allTimeRequests: number
    allTimeSuccessfullRequests: number
    allTimeNeutralRequests: number

    requestsPerMinute: ActionsPerMinuteLog
    failedRequestsPerMinute: ActionsPerMinuteLog
    successfullRequestsPerMinute: ActionsPerMinuteLog
    neutralRequestsPerMinute: ActionsPerMinuteLog
    workersPerMinute: ActionsPerMinuteLog
  }
}

function state (): StatisticsState {
  return {
    ddos: {
      allTimeRequests: 0,
      allTimeSuccessfullRequests: 0,
      allTimeNeutralRequests: 0,

      requestsPerMinute: new ActionsPerMinuteLog(),
      failedRequestsPerMinute: new ActionsPerMinuteLog(),
      successfullRequestsPerMinute: new ActionsPerMinuteLog(),
      neutralRequestsPerMinute: new ActionsPerMinuteLog(),
      workersPerMinute: new ActionsPerMinuteLog()
    }
  }
}

export default state
