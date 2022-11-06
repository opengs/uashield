
import axios from 'axios'
import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { NewsState, NewsEntry } from './state'

const NEWS_LINK = 'https://raw.githubusercontent.com/opengs/uashield/master/news.json'

const actions: ActionTree<NewsState, StateInterface> = {
  async load ({ commit }) {
    const response = await axios.get<Array<NewsEntry>>(NEWS_LINK)
    commit('SET_NEWS', response.data)
  }
}

export default actions
