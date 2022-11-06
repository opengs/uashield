import { MutationTree } from 'vuex'
import { NewsState, NewsEntry } from './state'

const mutation: MutationTree<NewsState> = {
  SET_NEWS (storage, news: Array<NewsEntry>) {
    storage.loaded = true
    storage.news = news
  }
}

export default mutation
