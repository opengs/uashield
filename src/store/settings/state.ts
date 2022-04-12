export interface SettingsState {
  language: string
  autoLaunch: boolean
  autoUpdate: boolean
  logTimestamp: boolean
  logRequests: boolean
}

function state (): SettingsState {
  return {
    language: 'en-US',
    autoLaunch: true,
    autoUpdate: true,
    logTimestamp: true,
    logRequests: true
  }
}

export default state
