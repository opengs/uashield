export interface ProxyData {
  auth: string;
  id: number;
  ip: string;
}

export interface SiteData {
  atack: number;
  id: number;
  // eslint-disable-next-line camelcase
  need_parse_url: number;
  page: string;
  // eslint-disable-next-line camelcase
  page_time: number;
  url: string;
}

export interface TargetData {
  site: SiteData;
  proxy: Array<ProxyData>;
}

export type DoserEventType = 'atack' | 'error';

export type GetSitesAndProxiesResponse = { sites: SiteData[]; proxies: ProxyData[]}
export const sitesUrl = 'https://raw.githubusercontent.com/opengs/uashieldtargets/master/sites.json'
export const proxiesUrl = 'https://raw.githubusercontent.com/opengs/uashieldtargets/master/proxy.json'
