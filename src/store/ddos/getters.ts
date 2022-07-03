import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { DDoSState } from './state'

import { PlaningStrategyType } from '../../../src-worker/planing/strategy'

export interface DDoSGetters {
  'ddos/enabled': boolean
  'ddos/planer': PlaningStrategyType
  'ddos/maxWorkers': number
  'ddos/workers': number
  'ddos/workersRate': number
  'ddos/withProxy': boolean

  'ddos/requestsInSession': number
  'ddos/realtimeSuccessAtackRate': number
  'ddos/allTimeSuccessAttackRate': number
  'ddos/requestsInSessionNotInStatistics': number
  'ddos/successfullRequestsInSessionNotInStatistics': number

  'ddos/currentAttack': string
}

const getters: GetterTree<DDoSState, StateInterface> = {
  enabled ({ enabled }) {
    return enabled
  },
  planer ({ planer }) {
    return planer
  },
  maxWorkers ({ maxWorkers }) {
    return maxWorkers
  },
  workers ({ workers }) {
    return workers
  },
  workersRate ({ workers, maxWorkers }) {
    return workers / maxWorkers
  },

  withProxy ({ withProxy }) {
    return withProxy
  },

  requestsInSession ({ requestsInSession }) {
    return requestsInSession
  },
  realtimeSuccessAtackRate ({ realtimeAttackCounter, realtimeSuccessfullAtackCounter }) {
    if (realtimeAttackCounter < 1) return 1
    return realtimeSuccessfullAtackCounter / realtimeAttackCounter
  },
  allTimeSuccessAttackRate ({ requestsInSession, successFullReqeustsInSession }) {
    if (requestsInSession < 1) return 1
    return successFullReqeustsInSession / requestsInSession
  },
  requestsInSessionNotInStatistics ({ requestsInSession, requestsAddedToStatistic }) {
    return requestsInSession - requestsAddedToStatistic
  },
  successfullRequestsInSessionNotInStatistics ({ successFullReqeustsInSession, successFullReqeustsAddedToStatistic }) {
    return successFullReqeustsInSession - successFullReqeustsAddedToStatistic
  },

  currentAttack ({ currentAttack }) {
    return currentAttack
  }
}

export default getters
