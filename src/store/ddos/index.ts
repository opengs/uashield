import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { DDoSState } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const ddosModule: Module<DDoSState, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default ddosModule
