import { GetSitesAndProxiesResponse, NameserverData, ProxyData, SiteData } from '../types'
import { getNameservers, getProxies, getSites } from '../requests'

export class ConfigurationService {
  public static readonly CONFIGURATION_INVALIDATION_TIME = 600_000 // 10 min
  private proxies: ProxyData[] | undefined = undefined
  private sites: SiteData[] | undefined = undefined
  private nameservers: NameserverData[] | undefined = undefined
  private expiredAt: Date | undefined = undefined

  async pullConfiguration (): Promise<GetSitesAndProxiesResponse> {
    if ((this.proxies && this.sites && this.nameservers) || this.expired()) {
      console.log('Reset configs')
      this.proxies = undefined
      this.sites = undefined
      this.nameservers = undefined
      this.expiredAt = undefined
    }

    if (this.sites === undefined) {
      try {
        console.log('try pulling sites config')
        const sites = await getSites()
        if (sites.status === 200) {
          this.sites = sites.data
          this.updateExpirationDate()
        }
      } catch (e) {
        console.log('can not pull the targets. Error: ', (e as Error).message)
      }
    }

    if (this.proxies === undefined) {
      try {
        console.log('try pulling proxy config')
        const proxies = await getProxies()
        if (proxies.status === 200) {
          this.proxies = proxies.data
          this.updateExpirationDate()
        }
      } catch (e) {
        console.log('can not pull the proxies. Error: ', (e as Error).message)
      }
    }

    if (this.nameservers === undefined) {
      try {
        console.log('try pulling nameservers config')
        const nameservers = await getNameservers()
        if (nameservers.status === 200) {
          this.nameservers = nameservers.data
          this.updateExpirationDate()
        }
      } catch (e) {
        console.log('can not pull the nameservers. Error: ', (e as Error).message)
      }
    }

    if (!this.sites || !this.proxies || !this.nameservers) {
      throw Error('Can not pull configuration')
    }

    return {
      sites: this.sites,
      proxies: this.proxies,
      nameservers: this.nameservers
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
