export interface DDoSData {
  enabled: boolean
  planer: 'manual' | 'automatic'
  maxWorkers: number
  workers: number
  withProxy: boolean
}

export interface UserData {
  ddos: DDoSData,

  statistics: {
    ddos: {
      allTimeRequests: number
      allTimeSuccessfullRequests: number
      allTimeNeutralRequests: number
    }
  },

  settings: {
    ip: string
    language: string
    log: {
      timestamp: boolean
      requests: boolean
    },
    autoLaunch?: boolean,
    autoUpdate: boolean,
    minimizeToTray: boolean
  }
}

export const defaultData = {
  ddos: {
    enabled: true,
    planer: 'automatic',
    maxWorkers: 128,
    workers: 32,
    withProxy: true
  },

  statistics: {
    ddos: {
      allTimeRequests: 0,
      allTimeSuccessfullRequests: 0,
      allTimeNeutralRequests: 0
    }
  },

  settings: {
    ip: '',
    language: 'en-US',
    log: {
      timestamp: true,
      requests: true
    },
    autoLaunch: undefined,
    autoUpdate: true,
    minimizeToTray: true
  }
} as UserData

export const USER_DATA_KEY = 'USER_DATA'

export interface StoreScheme {
  [USER_DATA_KEY]: UserData
}
