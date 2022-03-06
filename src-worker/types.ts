import { AxiosProxyConfig } from "axios";

export interface ProxyData {
  auth: string;
  id: number;
  ip: string;
}
export interface NameserverData {
  host: string;
  nameserverHost: string;
  nameserverIp: string;
}

export interface PrioritizedTarget {
  page: SiteData,
  proxyObj: AxiosProxyConfig  | undefined
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


export type DoserEventType = 'atack' | 'error';

export type GetSitesAndProxiesResponse = {
  sites: SiteData[];
  proxies: ProxyData[];
  nameservers: NameserverData[];
}
export const sitesUrl = 'https://raw.githubusercontent.com/opengs/uashieldtargets/v2/sites.json'
export const proxiesUrl = 'https://raw.githubusercontent.com/opengs/uashieldtargets/v2/proxy.json'
export const nameserversUrl = 'https://raw.githubusercontent.com/forzaukraine/uashieldtargets/dns-army/nameservers.json'
