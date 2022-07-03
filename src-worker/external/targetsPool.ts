import { Axios, AxiosResponse, AxiosError } from 'axios'

// const targetMethods = ['get', 'post', 'udp_flood', 'slowloris', 'dns_flood']
type TargetMethod = 'get' | 'post' | 'udp_flood' | 'slowloris' | 'dns_flood'

export interface StringRandomGenerator {
  type: 'string'
  name: string
  length?: number
  minLength?: number
  maxLength?: number
}

export interface EnumRandomGenerator {
  type: 'enum'
  name: string
  values: Array<string>
}

export interface IntegerRandomGenerator {
  type: 'integer'
  name: string
  minValue?: number
  maxValue?: number
}

export interface DateRandomGenerator {
  type: 'date'
  name: string
  /**
   * https://day.js.org/docs/en/display/format
  */
  format: string
  minValue?: string
  maxValue?: string
}

export interface TargetBase {
  method: TargetMethod
  name?: string
  randomGenerators?: Array<StringRandomGenerator | IntegerRandomGenerator | DateRandomGenerator | EnumRandomGenerator>
}

export interface UDPFloodTarget extends TargetBase {
  method: 'udp_flood'
  ip: string
  port: number
  domains?: Array<string>
}

export interface DNSFloodTarget extends TargetBase {
  method: 'dns_flood'
  ip: string
  port: number
}

export interface SlowLorisTarget extends TargetBase {
  method: 'slowloris'
  page: string
}

export interface GetTarget extends TargetBase {
  method: 'get'
  page: string
}

export interface PostTarget extends TargetBase {
  method: 'post'
  page: string
  body?: string
}

export type Target = GetTarget | PostTarget | UDPFloodTarget | SlowLorisTarget | DNSFloodTarget

const SOURCES_URL = 'https://raw.githubusercontent.com/opengs/uashieldtargets/master/target_sources.json'
interface Source {
  url: string
  type?: 'raw' | 'base64'
}

export class TargetsPool {
  protected sources: Source[]
  protected targets: Target[]

  private axiosClient: Axios

  constructor () {
    this.sources = []
    this.targets = []
    this.axiosClient = new Axios({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      transformResponse: (data) => (typeof data === 'string') ? JSON.parse(data) : data
    })
  }

  /**
   * Get random target from the pool
   *
   * @returns random target
   */
  getRandomTarget () : Target | null {
    if (this.targets.length === 0) return null
    return this.targets[Math.floor(Math.random() * this.targets.length)]
  }

  /**
   * Update targets list
   */
  async update () {
    // Get list of the external sources
    try {
      const sourcesResponse: AxiosResponse<Array<Source>> = await this.axiosClient.get(SOURCES_URL, { timeout: 30000, validateStatus: () => true })
      if (sourcesResponse.status !== 200) {
        console.warn(`Failed to load list of external targets resources. Status code: [${sourcesResponse.status}]`)
        return
      }
      this.sources = sourcesResponse.data
    } catch (e) {
      const code = (e as AxiosError).code
      const statusString = (code !== undefined) ? code : String(e).toString()
      console.warn(`Failed to load list of external targets resources. Error code: [${statusString}]`)
    }

    // Load proxyes from each resource
    const loadedTargetsList = [] as Target[]
    for (const source of this.sources) {
      try {
        const targets = await this.loadFromSource(source)
        if (!Array.isArray(targets)) {
          throw new Error('Loaded targets are not array.')
        }
        targets.forEach((t) => {
          t.method = t.method || 'get'
        })
        loadedTargetsList.push(...targets)
      } catch (e) {
        console.warn(`Failed to load targets from ${source.url}. Error: ${String(e)}`)
      }
    }

    if (loadedTargetsList.length > 0) {
      console.log('Loaded targets list')
      this.targets = loadedTargetsList
    } else {
      console.log('Failed to load targets list. Received empty list')
    }
  }

  /**
   * Load targets list from the source
   *
   * @param source where to load
   */
  protected async loadFromSource (source: Source) : Promise<Target[]> {
    let loadedRawData = ''
    try {
      const response: AxiosResponse<string> = await this.axiosClient.get(source.url, { timeout: 30000, responseType: 'text', transformResponse: (r: string) => r })
      loadedRawData = response.data
    } catch (e) {
      throw new Error(`Failed to load source due to error: ${String(e)}`)
    }

    if (source.type === 'base64') {
      try {
        loadedRawData = Buffer.from(loadedRawData, 'base64').toString('utf8')
      } catch (e) {
        throw new Error(`Failed to decode base64 data. Error: ${String(e)}`)
      }
    }

    try {
      return JSON.parse(loadedRawData) as Target[]
    } catch (e) {
      throw new Error(`Failed to load received data as JSON. Error: ${String(e)}`)
    }
  }

  deleteTarget (target: Target) : void {
    const idx = this.targets.indexOf(target)
    if (idx > -1) {
      this.targets.splice(idx, 1)
    }
  }
}
