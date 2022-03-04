import { GetSitesAndProxiesResponse, ProxyData, SiteData } from '../types'
import { getProxies, getSites } from '../requests'

export class ConfigurationService {
  public static readonly CONFIGURATION_INVALIDATION_TIME = 300000 // 5 min
  private proxies: ProxyData[] | undefined = undefined
  private sites: SiteData[] | undefined = undefined
  private expiredAt: Date | undefined = undefined

  async pullConfiguration (): Promise<GetSitesAndProxiesResponse> {
    if ((this.proxies && this.sites) || this.expired()) {
      console.log('Reset configs')
      this.proxies = undefined
      this.sites = undefined
      this.expiredAt = undefined
    }

    if (!this.sites) {
      try {
        const sites = await getSites()
        if (sites.status === 200) {
          this.sites = sites.data
          this.updateExpirationDate()
        }
      } catch (e) {
        console.log('can not pull the targets. Error: ', (e as Error).message)
      }
    }

    if (!this.proxies) {
      try {
        const proxies = await getProxies()
        if (proxies.status === 200) {
          this.proxies = proxies.data
          this.updateExpirationDate()
        }
      } catch (e) {
        console.log('can not pull the proxies. Error: ', (e as Error).message)
      }
    }

    if (!this.sites || !this.proxies) {
      throw Error('Can not pull configuration')
    }

    return {
      sites: this.sites,
      proxies: this.proxies
    }
  }

  expired (): boolean {
    return !this.expiredAt || this.expiredAt <= new Date()
  }

  private updateExpirationDate () {
    if (this.expiredAt) {
      return
    }
    this.expiredAt = new Date(new Date().getTime() + ConfigurationService.CONFIGURATION_INVALIDATION_TIME)
    console.log('Config valid until', this.expiredAt)
  }
}
