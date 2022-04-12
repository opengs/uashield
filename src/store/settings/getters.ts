import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { SettingsState } from './state'

export interface SettingsGetters {
  'settings/autoLaunch': boolean
  'settings/autoUpdate': boolean
  'settings/logTimestamp': boolean
  'settings/logRequests': boolean
}

const getters: GetterTree<SettingsState, StateInterface> = {
  autoLaunch ({ autoLaunch }) {
    return autoLaunch
  },
  autoUpdate ({ autoUpdate }) {
    return autoUpdate
  },
  logTimestamp ({ logTimestamp }) {
    return logTimestamp
  },
  logRequests ({ logRequests }) {
    return logRequests
  }
}

export default getters
