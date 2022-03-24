import { Axios, AxiosResponse, AxiosError } from 'axios'

const targetMethods = ['get', 'post']
export type TergetMethod = 'get' | 'post'

export interface GetTarget {
  method: 'get'
  page: string
}

export interface PostTarget {
  method: 'post'
  page: string
}

export type Target = GetTarget | PostTarget

const SOURCES_URL = 'https://raw.githubusercontent.com/opengs/uashieldtargets/master/target_sources.json'
interface Source {
  url: string
}

export class TargetsPool {
  protected sources: string[]
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
      this.sources = sourcesResponse.data.map((s) => s.url)
    } catch (e) {
      const code = (e as AxiosError).code
      const statusString = (code !== undefined) ? code : String(e).toString()
      console.warn(`Failed to load list of external targets resources. Error code: [${statusString}]`)
    }

    // Load proxyes from each resource
    const loadedTargetsList = [] as Target[]
    for (const url of this.sources) {
      const targets = await this.loadFromURL(url)
      if (typeof targets === 'string') {
        console.warn(targets)
      } else {
        loadedTargetsList.push(...targets.filter((t) => targetMethods.includes(t.method)))
      }
    }

    this.targets = loadedTargetsList
  }

  /**
   * Load targets list from the URL
   *
   * @param url where to make request
   */
  protected async loadFromURL (url: string) : Promise<Array<Target> | string> {
    let targets = [] as Target[]

    // Get list from the external source
    try {
      const response: AxiosResponse<Array<Target>> = await this.axiosClient.get(url, { timeout: 30000, validateStatus: () => true })
      if (response.status !== 200) {
        return `Server returned bad status code: ${response.status}`
      }
      targets = response.data
    } catch (e) {
      const code = (e as AxiosError).code
      return (code !== undefined) ? code : String(e).toString()
    }

    return targets
  }
}
