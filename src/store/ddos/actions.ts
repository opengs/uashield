import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { DDoSState } from './state'

import { UserData } from '../../../src-lib/storage'

const actions: ActionTree<DDoSState, StateInterface> = {
  loadFromUserData ({ commit }, data: UserData) {
    commit('UDPATE_ENABLED', data.ddos.enabled)
    commit('UDPATE_PLANER', data.ddos.planer)
    commit('UDPATE_MAX_WORKERS', data.ddos.maxWorkers)
    commit('UDPATE_WORKERS', data.ddos.workers)
    commit('UDPATE_WITHPROXY', data.ddos.withProxy)
  },

  updateEnabled ({ commit }, newValue: boolean) {
    window.require('electron').ipcRenderer.send('ddosUpdateEnabled', { newValue })
    commit('UDPATE_ENABLED', newValue)
  },
  updatePlaner ({ commit }, newValue: string) {
    window.require('electron').ipcRenderer.send('ddosUpdatePlaner', { newValue })
    commit('UDPATE_PLANER', newValue)
  },
  updateMaxWorkers ({ commit }, newValue: number) {
    window.require('electron').ipcRenderer.send('ddosUpdateMaxWorkers', { newValue })
    commit('UDPATE_MAX_WORKERS', newValue)
  },
  updateWorkers ({ commit }, newValue: number) {
    window.require('electron').ipcRenderer.send('ddosUpdateWorkers', { newValue })
    commit('UDPATE_WORKERS', newValue)
  },
  updateWithProxy ({ commit }, newValue: boolean) {
    window.require('electron').ipcRenderer.send('ddosUpdateWithProxy', { newValue })
    commit('UDPATE_WITHPROXY', newValue)
  },

  async handleAtack ({ commit, dispatch }, data: unknown) {
    commit('HANDLE_ATACK', data)
    await dispatch('tryMoveToStatistics')
  },
  handleWorkersCountUpdate ({ commit }, count: number) {
    commit('UDPATE_WORKERS', count)
  },

  async tryMoveToStatistics ({ commit, dispatch, state }) {
    const normalDiff = state.requestsInSession - state.requestsAddedToStatistic
    const successDiff = state.successFullReqeustsInSession - state.successFullReqeustsAddedToStatistic
    const neutralDiff = state.neutralRequestsInSession - state.neutralReqeustsAddedToStatistic

    if (normalDiff + successDiff + neutralDiff > 5000) {
      commit('MOVE_TO_STATISTIC')
      await dispatch('statistics/ddosAddRequests', {
        allTimeRequests: normalDiff,
        allTimeSuccessfullRequests: successDiff,
        allTimeNeutralRequests: neutralDiff
      }, { root: true })
    }
  }
}

export default actions
