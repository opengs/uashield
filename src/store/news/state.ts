export interface NewsEntry {
  index: number
  title: string
  content: string
  icon: string
  iconColor: string
  date: string
}

export interface NewsState {
  loaded: boolean
  news: Array<NewsEntry>
}

function state (): NewsState {
  return {
    loaded: false,
    news: []
  }
}

export default state
