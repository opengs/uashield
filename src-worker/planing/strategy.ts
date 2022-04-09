import { EventEmitter } from 'events'

import { Executor } from './executor'
import { ExecutorFactory } from './executorFactory'

import { ExecutionResult } from '../algorithms/algorithm'

export type PlaningStrategyType = 'manual' | 'automatic'
export type StrategyPlaningEventType = 'atack' | 'error' | 'automatic_executorsCountUpdate'

export abstract class PlaningStrategy {
  protected executorFactory: ExecutorFactory
  protected executors: Executor[]

  private eventEmitter: EventEmitter

  abstract get type(): PlaningStrategyType
  abstract get isRunning(): boolean

  constructor (executorFactory: ExecutorFactory) {
    this.executorFactory = executorFactory
    this.executors = []

    this.eventEmitter = new EventEmitter()
  }

  /**
   * Add event listener
   *
   * @param eventType type of the event
   * @param callback callback that must be raised on event
   */
  on (eventType: StrategyPlaningEventType, callback: (...args: unknown[]) => void) {
    this.eventEmitter.on(eventType, callback)
  }

  /**
   * Raise strategy event
   *
   * @param eventType event type
   * @param data data that will be passed to the callback
   */
  protected emit (eventType: StrategyPlaningEventType, data: unknown) {
    this.eventEmitter.emit(eventType, data)
  }

  protected resizeExecutors (newCount: number) {
    while (newCount < this.executors.length) {
      const executor = this.executors.pop()
      executor?.stop().catch((err) => {
        console.log(err)
      })
    }

    while (newCount > this.executors.length) {
      const executor = this.executorFactory.produce()
      this.onNewExecutor(executor)
      this.executors.push(executor)
    }
  }

  protected onNewExecutor (executor: Executor) {
    executor.on('algorithmExecuted', (data: ExecutionResult) => {
      this.emit('atack', data)
    })
  }

  abstract start(): void
  abstract stop(): void

  abstract setExecutorsCount(count: number): void
}
