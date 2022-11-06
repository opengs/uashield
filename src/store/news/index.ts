import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { NewsState } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const newsModule: Module<NewsState, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default newsModule
