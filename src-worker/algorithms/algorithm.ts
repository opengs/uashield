import { EventEmitter } from 'events'

export abstract class Algorithm extends EventEmitter {
  protected target: string

  constructor (target: string) {
    super()
    this.target = target
  }

  abstract isInstalled(): Promise<boolean>;
  abstract install(): Promise<void>;

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}
