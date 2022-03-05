import axios from 'axios-https-proxy-fix'
import { SiteData, ProxyData, sitesUrl, proxiesUrl, nameserversUrl, NameserverData } from './types'

export const getNameservers = () => axios.get<NameserverData[]>(nameserversUrl, { timeout: 10000 })
export const getSites = () => axios.get<SiteData[]>(sitesUrl, { timeout: 10000 })
export const getProxies = () => axios.get<ProxyData[]>(proxiesUrl, { timeout: 10000 })
