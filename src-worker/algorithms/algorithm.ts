import { Target } from '../external/targetsPool'

export interface Config {
  useRealIP: boolean

  timeout: number
}

export interface ExecutionResult {
  packetsSend: number
  packetsSuccess: number

  target: Target
}

export type AlgorithmType = 'get' | 'post' | 'udp_flood' | 'slowloris'

export abstract class Algorithm {
  protected config: Config

  constructor (config: Config) {
    this.config = config
  }

  abstract isValid (target: Target): boolean

  /**
   * Run one iteration of the algorithm
   */
  abstract execute (target: Target): Promise<ExecutionResult>
}
