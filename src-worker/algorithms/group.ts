import { AlgorithmType, Algorithm, Config } from './algorithm'
import { Get } from './get'
import { Post } from './post'

import { ProxyPool } from '../external/proxyPool'

export class AlgorithmGroup {
  protected algorithmMap: Map<AlgorithmType, Algorithm>

  constructor (config: Config, proxyPool: ProxyPool) {
    this.algorithmMap = new Map()
    this.algorithmMap.set('get', new Get(config, proxyPool))
    this.algorithmMap.set('post', new Post(config, proxyPool))
  }

  getByType (algorithmType: AlgorithmType) : Algorithm {
    return this.algorithmMap.get(algorithmType) as Algorithm
  }
}
