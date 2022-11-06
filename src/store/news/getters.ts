import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { NewsState, NewsEntry } from './state'

export interface NewsGetters {
  'news/news': Array<NewsEntry>
  'news/loaded': boolean
}

const getters: GetterTree<NewsState, StateInterface> = {
  news ({ news }) {
    return news
  },
  loaded ({ loaded }) {
    return loaded
  }
}

export default getters
