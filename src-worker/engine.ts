import { ProxyPool } from './external/proxyPool'
import { TargetsPool } from './external/targetsPool'
import { AlgorithmGroup } from './algorithms/group'
import { Config as AlgorithmsConfig } from './algorithms/algorithm'

import { PlaningStrategy, PlaningStrategyType } from './planing/strategy'
import { ExecutorFactory } from './planing/executorFactory'
import { ManualStrategy } from './planing/manualStrategy'
import { AutomaticStrategy } from './planing/automaticStrategy'
import { sleep } from './helpers'

/**
 * Core of the application backend. Entrypoint.
 */
export class Engine {
  protected proxyPool: ProxyPool
  protected targetsPool: TargetsPool
  protected algorithmsConfig: AlgorithmsConfig
  protected algorithmGroup: AlgorithmGroup

  protected executorFactory: ExecutorFactory
  protected executorPlaningStrategy: PlaningStrategy

  private working: boolean

  private updateWorkerInterval: number

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
    this.updateWorkerInterval = 10 * 60 * 1000 // 10 minutes
  }

  setExecutorStartegy (planingStrategyType: PlaningStrategyType) {
    this.executorPlaningStrategy.stop()
    console.log('Changing strategy to ' + planingStrategyType)
    switch (planingStrategyType) {
      case 'manual': this.executorPlaningStrategy = new ManualStrategy(this.executorFactory); break
      case 'automatic': this.executorPlaningStrategy = new AutomaticStrategy(this.executorFactory); break
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
    let lastUpdateTime = Date.now() - this.updateWorkerInterval * 2

    while (this.working) {
      try {
        if (Date.now() - lastUpdateTime > this.updateWorkerInterval) {
          lastUpdateTime = Date.now()
          await Promise.all([
            this.proxyPool.update(),
            this.targetsPool.update()
          ])
        }
      } catch (e) {
        console.error(e)
      }
      await sleep(1000)
    }
  }
}
