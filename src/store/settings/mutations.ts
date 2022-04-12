import { MutationTree } from 'vuex'
import { SettingsState } from './state'

const mutation: MutationTree<SettingsState> = {
  SET_AUTO_LAUNCH (storage, autoLaunch: boolean) {
    storage.autoLaunch = autoLaunch
  },
  SET_AUTO_UPDATE (storage, autoUpdate: boolean) {
    storage.autoUpdate = autoUpdate
  },
  SET_LOG_TIMESTAMP (storage, logTimestamp: boolean) {
    storage.logTimestamp = logTimestamp
  },
  SET_LOG_REQUESTS (storage, logRequests: boolean) {
    storage.logRequests = logRequests
  }
}

export default mutation
