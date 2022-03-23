import { PlaningStrategy } from './strategy'
import { Executor } from './executor'

import { ExecutionResult } from '../algorithms/algorithm'

const MIN_EXECUTORS_COUNT = 16
const MAX_EXECUTORS_COUNT = 2048
const UP_ADJUSTING_SLOPE = 64
const DOWN_ADJUSTING_SLOPE = 16

/**
 * Automatically controls count of executors
 */
export class AutomaticStrategy extends PlaningStrategy {
  protected maxExecutorsCount = 2048
  protected adjustedValue = 0

  start (): void {
    this.adjustedValue = 0
    this.resizeExecutors(32)
  }

  stop (): void {
    this.resizeExecutors(0)
  }

  setExecutorsCount (count: number): void {
    this.resizeExecutors(count)
  }

  protected adjustExecutorsCount () {
    if (this.executors.length === 0) {
      // Stopped. return
      return
    }

    let newExecutorsCount = this.executors.length

    // increase executors count if everything is ok
    while (this.adjustedValue > UP_ADJUSTING_SLOPE) {
      this.adjustedValue -= UP_ADJUSTING_SLOPE
      newExecutorsCount += 1
    }

    // reduce executors count if everything is bad
    while (this.adjustedValue < -DOWN_ADJUSTING_SLOPE) {
      this.adjustedValue += DOWN_ADJUSTING_SLOPE
      newExecutorsCount -= 1
    }

    newExecutorsCount = Math.min(newExecutorsCount, MAX_EXECUTORS_COUNT)
    newExecutorsCount = Math.max(newExecutorsCount, MIN_EXECUTORS_COUNT)

    if (newExecutorsCount !== this.executors.length) {
      console.log(`Automatic planer changed workers count from [${this.executors.length}] to [${newExecutorsCount}]`)
      this.resizeExecutors(newExecutorsCount)
      this.emit('automatic_executorsCountUpdate', newExecutorsCount)
    }
  }

  protected onNewExecutor (executor: Executor) {
    super.onNewExecutor(executor)
    executor.on('algorithmExecuted', (data: ExecutionResult) => {
      this.adjustedValue += data.packetsSuccess
      this.adjustedValue -= (data.packetsSend - data.packetsSuccess) // remove failed packets
      this.adjustExecutorsCount()
    })
  }
}
