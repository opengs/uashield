import { Axios, AxiosResponse, AxiosError } from 'axios'

export type ProxyScheme = 'socks4' | 'socks5' | 'http' | 'https'
export interface Proxy {
  host: string
  port: number
  scheme: ProxyScheme
  username?: string
  password?: string
}

const SOURCES_URL = 'https://raw.githubusercontent.com/opengs/uashieldtargets/master/proxy_sources.json'
interface Source {
  url: string
}

/**
 * Fetches and stores information about available proxyes.
 */
export class ProxyPool {
  protected sources: string[]

  protected proxyes: Proxy[]
  protected proxyesByScheme: Map<ProxyScheme, Array<Proxy>>

  private axiosClient: Axios

  constructor () {
    this.sources = []
    this.proxyes = []
    this.proxyesByScheme = new Map<ProxyScheme, Array<Proxy>>()
    this.axiosClient = new Axios({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      transformResponse: (data) => (typeof data === 'string') ? JSON.parse(data) : data
    })
  }

  /**
   * Gets random proxy
   *
   * @param proxySchemes array of posible schemes.
   * @returns random proxy or null if proxy wasnt found
   */
  getRandomProxy (proxySchemes?: Array<ProxyScheme>) : Proxy | null {
    if (proxySchemes) {
      const schemes = this.shuffle([...proxySchemes]) // clone, because shuffle is inplace
      for (const scheme of schemes) {
        const possibleProxyes = this.proxyesByScheme.get(scheme)
        if (possibleProxyes === undefined) continue
        if (possibleProxyes.length === 0) continue
        return possibleProxyes[Math.floor(Math.random() * possibleProxyes.length)]
      }

      return null
    }

    if (this.proxyes.length === 0) return null
    return this.proxyes[Math.floor(Math.random() * this.proxyes.length)]
  }

  /**
   * Update proxy list.
   */
  async update () {
    // Get list of the external sources
    try {
      const sourcesResponse: AxiosResponse<Array<Source>> = await this.axiosClient.get(SOURCES_URL, { timeout: 30000, validateStatus: () => true })
      if (sourcesResponse.status !== 200) {
        console.warn(`Failed to load list of external proxy resources. Status code: [${sourcesResponse.status}]`)
        return
      }
      this.sources = sourcesResponse.data.map((s) => s.url)
    } catch (e) {
      const code = (e as AxiosError).code
      const statusString = (code !== undefined) ? code : String(e).toString()
      console.warn(`Failed to load list of external proxy resources. Error code: [${statusString}]`)
    }

    // Load proxyes from each resource
    let loadedProxyList = [] as Proxy[]
    for (const url of this.sources) {
      const proxyes = await this.loadFromURL(url)
      if (typeof proxyes === 'string') {
        console.warn(`Failed to load proxy resource ${url}. Error: [${proxyes}]`)
      } else {
        loadedProxyList = [...loadedProxyList, ...proxyes]
      }
    }

    if (loadedProxyList.length > 0) {
      console.log('Loaded proxy list')
      this.proxyes = loadedProxyList

      this.proxyesByScheme = new Map()
      this.proxyesByScheme.set('http', [])
      this.proxyesByScheme.set('https', [])
      this.proxyesByScheme.set('socks4', [])
      this.proxyesByScheme.set('socks5', [])

      for (const proxy of this.proxyes) {
        this.proxyesByScheme.get(proxy.scheme)?.push(proxy)
      }
    } else {
      console.log('Failed to load proxy list. Loaded empty')
    }
  }

  /**
   * Load proxy list from the URL
   *
   * @param url where to make request
   */
  protected async loadFromURL (url: string) : Promise<Array<Proxy> | string> {
    let proxyes = [] as Proxy[]

    // Get list from the external source
    try {
      const response: AxiosResponse<Array<Proxy>> = await this.axiosClient.get(url, { timeout: 30000, validateStatus: () => true })
      if (response.status !== 200) {
        return `Server returned bad status code: ${response.status}`
      }
      proxyes = response.data
    } catch (e) {
      const code = (e as AxiosError).code
      return (code !== undefined) ? code : String(e).toString()
    }

    // Verify every proxy if it is valid
    for (const proxy of proxyes) {
      const err = this.verifyProxy(proxy)
      if (err !== null) return 'Validation error: ' + err
    }

    return proxyes
  }

  /**
   * Verifyes proxy data.
   *
   * // TODO: host verification (if valid IP or domain name)
   *
   * @param proxy Proxy data to verify
   * @returns null if everything ok. string with error if something fails
   */
  protected verifyProxy (proxy: Proxy): null | string {
    // host
    if (proxy.host === undefined || proxy.host === null) return 'Host field undefined or null'
    if (typeof proxy.host !== 'string') return 'Host is not a string value'
    if (proxy.host === '') return 'Host is empty'

    // port
    if (proxy.port === undefined || proxy.port === null) return 'Port field undefined or null'
    if (typeof proxy.port !== 'number') return 'Port is not a number value'
    if (proxy.port <= 0 || proxy.port >= 65535) return 'Port is not in valid range'

    // scheme
    if (proxy.scheme === undefined || proxy.scheme === null) return 'Scheme field undefined or null'
    if (typeof proxy.scheme !== 'string') return 'Scheme is not a string value'
    if (proxy.scheme !== 'http' && proxy.scheme !== 'https' && proxy.scheme !== 'socks4' && proxy.scheme !== 'socks5') return 'Scheme is not valid'

    // auth
    if (proxy.username === '') return 'Auth username field is empty'
    if (proxy.password === '') return 'Auth username field is empty'
    if (proxy.username === null) return 'Auth username field is null'
    if (proxy.password === null) return 'Auth username field is null'
    if (proxy.username !== undefined || proxy.password !== undefined) {
      if (proxy.username === undefined || proxy.username === null) return 'Auth username field undefined or null but password is provided'
      if (typeof proxy.username !== 'string') return 'Auth username is not a string value'
      if (proxy.password === undefined || proxy.password === null) return 'Auth password field undefined or null but username is provided'
      if (typeof proxy.password !== 'string') return 'Auth password is not a string value'
    }

    return null
  }

  /**
   * Shuffle proxy array.
   *
   * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   *
   * @param array
   * @returns
   */
  private shuffle<T> (array: Array<T>) {
    let currentIndex = array.length, randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }

    return array
  }
}
