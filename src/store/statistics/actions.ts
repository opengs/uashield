import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { StatisticsState } from './state'

import { UserData } from '../../../src-lib/storage'

const actions: ActionTree<StatisticsState, StateInterface> = {
  loadFromUserData ({ commit }, data: UserData) {
    commit('DDOS_SET_REQUESTS', {
      allTimeRequests: data.statistics.ddos.allTimeRequests,
      allTimeSuccessfullRequests: data.statistics.ddos.allTimeSuccessfullRequests,
      allTimeNeutralRequests: data.statistics.ddos.allTimeNeutralRequests
    })
  },

  ddosAddRequests ({ commit }, data: { allTimeRequests: number, allTimeSuccessfullRequests: number, allTimeNeutralRequests: number }) {
    window.require('electron').ipcRenderer.send('statisticsDDoSAddRequests', data)
    commit('DDOS_ADD_REQUESTS', data)
  },

  handleAtack ({ commit }, data: unknown) {
    commit('HANDLE_ATACK', data)
  },
  handleWorkersCountUpdate ({ commit }, count: number) {
    commit('HANDLE_WORKERS_COUNT_UPDATE', count)
  }
}

export default actions
