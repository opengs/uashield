import { ProxyPool } from './external/proxyPool'
import { TargetsPool } from './external/targetsPool'
import { AlgorithmGroup } from './algorithms/group'
import { Config as AlgorithmsConfig } from './algorithms/algorithm'

import { PlaningStrategy, PlaningStrategyType } from './planing/strategy'
import { ExecutorFactory } from './planing/executorFactory'
import { ManualStrategy } from './planing/manualStrategy'

/**
 * Core of the appliccation backend. Entrypoint.
 */
export class Engine {
  protected proxyPool: ProxyPool
  protected targetsPool: TargetsPool
  protected algorithmsConfig: AlgorithmsConfig
  protected algorithmGroup: AlgorithmGroup

  protected executorFactory: ExecutorFactory
  protected executorPlaningStrategy: PlaningStrategy

  private working: boolean

  get executionStartegy () { return this.executorPlaningStrategy }
  get config () { return this.algorithmsConfig }

  constructor () {
    this.proxyPool = new ProxyPool()
    this.targetsPool = new TargetsPool()

    this.algorithmsConfig = {
      useRealIP: false,
      timeout: 10000
    }
    this.algorithmGroup = new AlgorithmGroup(this.algorithmsConfig, this.proxyPool)

    this.executorFactory = new ExecutorFactory(this.targetsPool, this.algorithmGroup)
    this.executorPlaningStrategy = new ManualStrategy(this.executorFactory)

    this.working = false
  }

  setExecutorStartegy (planingStrategyType: PlaningStrategyType) {
    this.executorPlaningStrategy.stop()
    if (planingStrategyType === 'manual') {
      this.executorPlaningStrategy = new ManualStrategy(this.executorFactory)
    }
    this.executorPlaningStrategy.start()
  }

  start () {
    this.working = true
    void this.updateWorker()
    this.executorPlaningStrategy.start()
  }

  stop () {
    this.working = false
    this.executorPlaningStrategy.stop()
  }

  async updateWorker () {
    let lastUpdateTime = new Date(1999, 1, 10)

    while (this.working) {
      try {
        const seconds = Math.round(((new Date()).getTime() - lastUpdateTime.getTime()) / 1000)
        if (seconds > 60000) {
          lastUpdateTime = new Date()
          await Promise.all([
            this.proxyPool.update(),
            this.targetsPool.update()
          ])
        }
        await new Promise(resolve => setTimeout(resolve, 50))
      } catch (e) {
        console.error(e)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }
}
