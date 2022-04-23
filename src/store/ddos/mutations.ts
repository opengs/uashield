import { MutationTree } from 'vuex'
import { DDoSState } from './state'

import { PlaningStrategyType } from '../../../src-worker/planing/strategy'

const mutation: MutationTree<DDoSState> = {
  UDPATE_ENABLED (storage, newValue: boolean) {
    storage.enabled = newValue
    storage.workers = 32
  },
  UDPATE_PLANER (storage, newValue: PlaningStrategyType) {
    storage.planer = newValue
    storage.maxWorkers = 128
    storage.workers = 32
  },
  UDPATE_MAX_WORKERS (storage, newValue: number) {
    storage.maxWorkers = newValue
    storage.workers = Math.min(storage.workers, newValue)
  },
  UDPATE_WORKERS (storage, newValue: number) {
    storage.workers = newValue
  },
  UDPATE_WITHPROXY (storage, newValue: boolean) {
    storage.withProxy = newValue
  },

  HANDLE_ATACK (storage, data: { target: { page: string, name?: string, method: string }, packetsSend: number, packetsSuccess: number, packetsNeutral: number }) {
    if ((new Date()).getTime() - storage.lastAttackChange.getTime() > 1000) {
      const targetName = (data.target.name !== undefined) ? data.target.name : data.target.page
      storage.currentAttack = `${data.target.method} | ${targetName}`
      storage.lastAttackChange = new Date()
    }
    storage.requestsInSession += data.packetsSend
    storage.neutralRequestsInSession += data.packetsNeutral
    storage.successFullReqeustsInSession += data.packetsSuccess

    storage.realtimeAttackCounter += data.packetsSend - data.packetsNeutral
    storage.realtimeSuccessfullAtackCounter += data.packetsSuccess
    if (storage.realtimeAttackCounter > 1000) {
      storage.realtimeAttackCounter /= 2
      storage.realtimeSuccessfullAtackCounter /= 2
    }
  },

  MOVE_TO_STATISTIC (storage) {
    storage.requestsAddedToStatistic = storage.requestsInSession
    storage.neutralReqeustsAddedToStatistic = storage.neutralRequestsInSession
    storage.successFullReqeustsAddedToStatistic = storage.successFullReqeustsInSession
  }
}

export default mutation
