import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { SettingsState } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const settingsModule: Module<SettingsState, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default settingsModule
