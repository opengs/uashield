import { PlaningStrategy } from './strategy'

/**
 * Manually controls count of executors
 */
export class ManualStrategy extends PlaningStrategy {
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
