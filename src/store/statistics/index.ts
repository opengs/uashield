import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { StatisticsState } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const statisticsModule: Module<StatisticsState, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default statisticsModule
