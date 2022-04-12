import { PlaningStrategyType } from '../../../src-worker/planing/strategy'

export interface DDoSState {
  enabled: boolean
  planer: PlaningStrategyType
  maxWorkers: number
  workers: number
  withProxy: boolean

  requestsInSession: number
  successFullReqeustsInSession: number
  requestsAddedToStatistic: number
  successFullReqeustsAddedToStatistic: number
  neutralRequestsInSession: number
  neutralReqeustsAddedToStatistic: number

  currentAttack: string
  lastAttackChange: Date
  realtimeAttackCounter: number
  realtimeSuccessfullAtackCounter: number
}

function state (): DDoSState {
  return {
    enabled: true,
    planer: 'automatic',
    maxWorkers: 128,
    workers: 32,
    withProxy: true,

    requestsInSession: 0,
    successFullReqeustsInSession: 0,
    neutralRequestsInSession: 0,
    requestsAddedToStatistic: 0,
    successFullReqeustsAddedToStatistic: 0,
    neutralReqeustsAddedToStatistic: 0,

    currentAttack: '--- LOADING ---',
    lastAttackChange: new Date(),
    realtimeAttackCounter: 0,
    realtimeSuccessfullAtackCounter: 0
  }
}

export default state
