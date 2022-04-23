export interface ProviderHit {
  ok: boolean
}

export interface PhoneNumber {
  countryCode: number
  localPhone: number
}

export abstract class Provider {
  abstract get name(): string

  abstract setTarget(phone: PhoneNumber): void

  abstract start(): void
  abstract stop(): void

  abstract execute (): Promise<ProviderHit>
}
