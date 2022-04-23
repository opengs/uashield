import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { StatisticsState } from './state'

export interface StatisticsGetters {
  'statistics/rank': number

  'statistics/ddosAllTimeRequests': number
  'statistics/ddosAllTimeSuccessfullRequests': number
  'statistics/ddosAllTimeSuccessRequestsRate': number

  'statistics/ddosRequestsPerMinute': Array<{timestamp: number, count: number}>
  'statistics/ddosFailedRequestsPerMinute': Array<{timestamp: number, count: number}>
  'statistics/ddosSuccessfullRequestsPerMinute': Array<{timestamp: number, count: number}>
  'statistics/ddosNeutralRequestsPerMinute': Array<{timestamp: number, count: number}>
  'statistics/ddosWorkersPerMinute': Array<{timestamp: number, count: number}>
}

const getters: GetterTree<StatisticsState, StateInterface> = {
  rank ({ ddos }) {
    return Math.min(Math.floor(ddos.allTimeSuccessfullRequests / 3000000), 24)
  },

  ddosAllTimeRequests ({ ddos }) {
    return ddos.allTimeRequests
  },
  ddosAllTimeSuccessfullRequests ({ ddos }) {
    return ddos.allTimeSuccessfullRequests
  },
  ddosAllTimeSuccessRequestsRate ({ ddos }) {
    if (ddos.allTimeRequests < 1) return 1
    return ddos.allTimeSuccessfullRequests / ddos.allTimeRequests
  },

  ddosRequestsPerMinute ({ ddos }) {
    return ddos.requestsPerMinute.log
  },
  ddosFailedRequestsPerMinute ({ ddos }) {
    return ddos.failedRequestsPerMinute.log
  },
  ddosSuccessfullRequestsPerMinute ({ ddos }) {
    return ddos.successfullRequestsPerMinute.log
  },
  ddosNeutralRequestsPerMinute ({ ddos }) {
    return ddos.neutralRequestsPerMinute.log
  },
  ddosWorkersPerMinute ({ ddos }) {
    return ddos.workersPerMinute.log
  }
}

export default getters
