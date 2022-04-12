import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { SettingsState } from './state'

import { UserData } from '../../../src-lib/storage'

const actions: ActionTree<SettingsState, StateInterface> = {
  loadFromUserData ({ commit }, data: UserData) {
    commit('SET_AUTO_LAUNCH', data.settings.autoLaunch)
    commit('SET_AUTO_UPDATE', data.settings.autoUpdate)
    commit('SET_LOG_TIMESTAMP', data.settings.log.timestamp)
    commit('SET_LOG_REQUESTS', data.settings.log.requests)
  },

  setAutoLaunch ({ commit }, value: boolean) {
    window.require('electron').ipcRenderer.send('settingsSetAutoLaunch', value)
    commit('SET_AUTO_LAUNCH', value)
  },
  setAutoUpdate ({ commit }, value: boolean) {
    window.require('electron').ipcRenderer.send('settingsSetAutoUpdate', value)
    commit('SET_AUTO_UPDATE', value)
  },
  setLogTimestamp ({ commit }, value: boolean) {
    window.require('electron').ipcRenderer.send('settingsSetLogTimestamp', value)
    commit('SET_LOG_TIMESTAMP', value)
  },
  setLogRequests ({ commit }, value: boolean) {
    window.require('electron').ipcRenderer.send('settingsSetLogRequests', value)
    commit('SET_LOG_REQUESTS', value)
  }
}

export default actions
