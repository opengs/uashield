import { i18n } from '../../boot/i18n'

import { MutationTree } from 'vuex'
import { SettingsState } from './state'

const mutation: MutationTree<SettingsState> = {
  SET_IP (storage, ip: string) {
    storage.ip = ip
  },
  SET_COUNTRYCODE (storage, countryCode: string) {
    storage.countryCode = countryCode
  },
  SET_LANGUAGE (storage, language: string) {
    i18n.global.locale = language
    storage.language = language
  },
  SET_AUTO_LAUNCH (storage, autoLaunch: boolean) {
    storage.autoLaunch = autoLaunch
  },
  SET_AUTO_UPDATE (storage, autoUpdate: boolean) {
    storage.autoUpdate = autoUpdate
  },
  SET_MINIMIZE_TO_TRAY (storage, minimizeToTray: boolean) {
    storage.minimizeToTray = minimizeToTray
  },
  SET_LOG_TIMESTAMP (storage, logTimestamp: boolean) {
    storage.logTimestamp = logTimestamp
  },
  SET_LOG_REQUESTS (storage, logRequests: boolean) {
    storage.logRequests = logRequests
  }
}

export default mutation
