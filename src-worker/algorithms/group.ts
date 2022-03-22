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

  getByType (algorithmType: AlgorithmType) : Algorithm | null {
    const alg = this.algorithmMap.get(algorithmType)
    if (alg === undefined) return null
    return alg
  }
}
