import { AxiosProxyConfig } from "axios";

export type ProxyScheme = 'socks4' | 'socks5' | 'http' | 'https'

export interface ProxyData {
  auth?: string;
  scheme: ProxyScheme
  ip: string;
}

export interface ProxyRequestData {
  host: string
  port: number
  scheme: ProxyScheme
  username?: string
  password?: string
}

export interface PrioritizedTarget {
  page: SiteData,
  proxyObj?: ProxyRequestData
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

export type GetSitesAndProxiesResponse = { sites: SiteData[]; proxies: ProxyData[]} | null
export const sitesUrl = 'https://raw.githubusercontent.com/opengs/uashieldtargets/v2/sites.json'
export const proxiesUrl = 'https://raw.githubusercontent.com/opengs/uashieldtargets/v2/proxy.json'
