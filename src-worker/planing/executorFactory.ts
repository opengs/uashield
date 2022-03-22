import { AlgorithmGroup } from '../algorithms/group'
import { TargetsPool } from '../external/targetsPool'
import { Executor } from './executor'

/**
 * Produces new executors.
 */
export class ExecutorFactory {
  protected targetsPool: TargetsPool
  protected algorithmGroup: AlgorithmGroup

  constructor (targetsPool: TargetsPool, algorithmGroup: AlgorithmGroup) {
    this.targetsPool = targetsPool
    this.algorithmGroup = algorithmGroup
  }

  produce (): Executor {
    return new Executor(this.targetsPool, this.algorithmGroup)
  }
}
