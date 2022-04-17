import { EventEmitter } from 'events'

import { AlgorithmGroup } from '../algorithms/group'

import { TargetsPool } from '../external/targetsPool'
import { sleep } from '../helpers'

export type ExecutorEventType = 'algorithmExecuted'

/**
 * Executes algorithms based on received targets
 */
export class Executor {
  protected running: boolean
  protected targetsPool: TargetsPool
  protected algorithmGroup: AlgorithmGroup

  private eventEmitter: EventEmitter

  constructor (targetsPool: TargetsPool, algorithmGroup: AlgorithmGroup) {
    this.running = true
    this.targetsPool = targetsPool
    this.algorithmGroup = algorithmGroup
    setImmediate(() => void this.worker.bind(this)())

    this.eventEmitter = new EventEmitter()
  }

  /**
   * Adds event listener
   *
   * @param eventType event type to listen
   * @param callback function to execute
   */
  on <T> (eventType: ExecutorEventType, callback: (arg: T) => void) {
    this.eventEmitter.addListener(eventType, callback)
  }

  /**
   * Stops executor
   */
  stop () {
    this.running = false
  }

  protected async worker () {
    while (this.running) {
      try {
        await this.runIteration()
      } catch (e) {
        console.error(e)
        await sleep(100)
      }
    }
  }

  protected async runIteration () {
    const target = this.targetsPool.getRandomTarget()

    if (target === null) {
      // Wait for targets
      await sleep(5000)
      return
    }

    const algorithm = this.algorithmGroup.getByType(target.method)

    // delete the target from the targetsPool if it is not valid
    if (!algorithm.isValid(target)) {
      this.targetsPool.deleteTarget(target)
      return
    }

    const result = await algorithm.execute(target)
    this.eventEmitter.emit('algorithmExecuted', result)
  }
}
