import { GetSitesAndProxiesResponse, NameserverData, ProxyData, SiteData } from '../types'
import { getProxies, getSites } from '../requests'

export class ConfigurationService {
  public static readonly CONFIGURATION_INVALIDATION_TIME = 300000 // 5 min
  private proxies: ProxyData[] | undefined = undefined
  private sites: SiteData[] | undefined = undefined
  private expiredAt: Date | undefined = undefined
  private nameservers: NameserverData[] = []

  async pullConfiguration (): Promise<GetSitesAndProxiesResponse> {
    if ((this.proxies && this.sites && this.nameservers) || this.expired()) {
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
    this.nameservers = [
      {
        host: 'tinkoff.ru',
        nameserverHost: 'ns8-l2.nic.ru.',
        nameserverIp: '91.217.21.1'
      },
      {
        host: 'tinkoff.ru',
        nameserverHost: 'ns2.tinkoff.ru.',
        nameserverIp: '185.169.154.98'
      },
      {
        host: 'tinkoff.ru',
        nameserverHost: 'ns1.tinkoff.ru.',
        nameserverIp: '178.248.239.11'
      },
      {
        host: 'tinkoff.ru',
        nameserverHost: 'ns4-l2.nic.ru.',
        nameserverIp: '91.217.20.1'
      }
    ]

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
