import { PlaningStrategy, PlaningStrategyType } from './strategy'

/**
 * Manually controls count of executors
 */
export class ManualStrategy extends PlaningStrategy {
  get type (): PlaningStrategyType {
    return 'manual'
  }

  get isRunning (): boolean {
    return this.executors.length !== 0
  }

  start (): void {
    this.resizeExecutors(32)
  }

  stop (): void {
    this.resizeExecutors(0)
  }

  setExecutorsCount (count: number): void {
    this.resizeExecutors(count)
  }
}
