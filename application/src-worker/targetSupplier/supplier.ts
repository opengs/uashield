export interface TargetInfo {
  url: string
  timestamp: number
}

export default abstract class TargetSupplier {
  abstract findNext(): Promise<TargetInfo>;
}
