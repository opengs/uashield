import { MutationTree } from 'vuex'
import { StatisticsState } from './state'

const mutation: MutationTree<StatisticsState> = {
  DDOS_SET_REQUESTS (storage, data: { allTimeRequests: number, allTimeSuccessfullRequests: number, allTimeNeutralRequests: number }) {
    storage.ddos.allTimeRequests = data.allTimeRequests
    storage.ddos.allTimeSuccessfullRequests = data.allTimeSuccessfullRequests
    storage.ddos.allTimeNeutralRequests = data.allTimeNeutralRequests
  },
  DDOS_ADD_REQUESTS (storage, data: { allTimeRequests: number, allTimeSuccessfullRequests: number, allTimeNeutralRequests: number }) {
    storage.ddos.allTimeRequests += data.allTimeRequests
    storage.ddos.allTimeSuccessfullRequests += data.allTimeSuccessfullRequests
    storage.ddos.allTimeNeutralRequests += data.allTimeNeutralRequests
  },

  HANDLE_ATACK (storage, data: { packetsSend: number, packetsSuccess: number, packetsNeutral: number }) {
    storage.ddos.requestsPerMinute.add(data.packetsSend)
    storage.ddos.failedRequestsPerMinute.add(data.packetsSend - data.packetsSuccess - data.packetsNeutral)
    storage.ddos.successfullRequestsPerMinute.add(data.packetsSuccess)
    storage.ddos.neutralRequestsPerMinute.add(data.packetsNeutral)
  },

  HANDLE_WORKERS_COUNT_UPDATE (storage, count: number) {
    storage.ddos.workersPerMinute.set(count)
  }
}

export default mutation
