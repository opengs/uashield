import { AlgorithmType, Algorithm, Config } from './algorithm'
import { Get } from './get'
import { Post } from './post'
import { UDPFlood } from './udpFlood'
import { SlowLoris } from './slowloris'

import { ProxyPool } from '../external/proxyPool'

export class AlgorithmGroup {
  protected algorithmMap: Map<AlgorithmType, Algorithm>

  constructor (config: Config, proxyPool: ProxyPool) {
    this.algorithmMap = new Map()
    this.algorithmMap.set('get', new Get(config, proxyPool))
    this.algorithmMap.set('post', new Post(config, proxyPool))
    this.algorithmMap.set('udp_flood', new UDPFlood(config))
    this.algorithmMap.set('slowloris', new SlowLoris(config))
  }

  getByType (algorithmType: AlgorithmType) : Algorithm {
    return this.algorithmMap.get(algorithmType) as Algorithm
  }
}
