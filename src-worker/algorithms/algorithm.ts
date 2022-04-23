import { Target } from '../external/targetsPool'

export interface Config {
  logRequests: boolean
  logTimestamp: boolean

  useRealIP: boolean

  timeout: number
}

export interface ExecutionResult {
  packetsSend: number
  packetsSuccess: number
  packetsNeutral: number

  target: Target
}

export type AlgorithmType = 'get' | 'post' | 'udp_flood' | 'slowloris' | 'dns_flood'
export type runningValidation = () => boolean

export abstract class Algorithm {
  protected config: Config

  constructor (config: Config) {
    this.config = config
  }

  /**
   * Check if target data is valid for this algorithm
   */
  abstract isValid (target: Target): boolean

  /**
   * Check if algorithm can be executed for current target with current settings
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canExecute (target: Target): boolean { return true }

  /**
   * Run one iteration of the algorithm
   */
  abstract execute (target: Target, isRunning: runningValidation): Promise<ExecutionResult>
}
