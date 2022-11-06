export interface SettingsState {
  ip: string
  countryCode: string
  lat: number
  lon: number

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
    countryCode: '',
    lat: 0,
    lon: 0,

    language: 'en-US',
    autoLaunch: true,
    autoUpdate: true,
    minimizeToTray: true,
    logTimestamp: true,
    logRequests: true
  }
}

export default state
