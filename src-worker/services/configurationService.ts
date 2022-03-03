import { GetSitesAndProxiesResponse, ProxyData, SiteData } from '../types'
import { getProxies, getSites } from '../requests'

export class ConfigurationService {
  private proxies: ProxyData[] | undefined = undefined
  private sites: SiteData[] | undefined = undefined

  async pullConfiguration (): Promise<GetSitesAndProxiesResponse> {
    const [proxies, sites] = await Promise.all([getProxies(), getSites()])
    let valid = true

    if (proxies.status === 200) {
      this.proxies = proxies.data
    } else {
      valid = false
    }
    if (sites.status === 200) {
      this.sites = sites.data
    } else {
      valid = false
    }

    if (!valid) {
      throw Error('Can not pull configuration')
    }

    return {
      sites: (this.sites as SiteData[]),
      proxies: (this.proxies as ProxyData[])
    }
  }

  expired (): boolean {
    return false
  }
}
