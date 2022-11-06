export interface SettingsState {
  ip: string
  language: string
  autoLaunch: boolean
  autoUpdate: boolean
  minimizeToTray: boolean
  logTimestamp: boolean
  logRequests: boolean
}

function state (): SettingsState {
  return {
    ip: '',
    language: 'en-US',
    autoLaunch: true,
    autoUpdate: true,
    minimizeToTray: true,
    logTimestamp: true,
    logRequests: true
  }
}

export default state
