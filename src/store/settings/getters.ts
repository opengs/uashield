import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { SettingsState } from './state'

export interface SettingsGetters {
  'settings/language': string
  'settings/autoLaunch': boolean
  'settings/autoUpdate': boolean
  'settings/minimizeToTray': boolean
  'settings/logTimestamp': boolean
  'settings/logRequests': boolean
}

const getters: GetterTree<SettingsState, StateInterface> = {
  language ({ language }) {
    return language
  },
  autoLaunch ({ autoLaunch }) {
    return autoLaunch
  },
  autoUpdate ({ autoUpdate }) {
    return autoUpdate
  },
  minimizeToTray ({ minimizeToTray }) {
    return minimizeToTray
  },
  logTimestamp ({ logTimestamp }) {
    return logTimestamp
  },
  logRequests ({ logRequests }) {
    return logRequests
  }
}

export default getters
