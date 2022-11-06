import { store } from 'quasar/wrappers'
import { InjectionKey } from 'vue'
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore
} from 'vuex'

import ddos from './ddos'
import { DDoSState } from './ddos/state'
import { DDoSGetters } from './ddos/getters'

import news from './news'
import { NewsState } from './news/state'
import { NewsGetters } from './news/getters'

import statistics from './statistics'
import { StatisticsState } from './statistics/state'
import { StatisticsGetters } from './statistics/getters'

import settings from './settings'
import { SettingsState } from './settings/state'
import { SettingsGetters } from './settings/getters'

export interface StateInterface {
  ddos: DDoSState
  statistics: StatisticsState
  settings: SettingsState
  news: NewsState
}

type Store = Omit<
  VuexStore<StateInterface>,
  'getters'
> & {
  getters:
  DDoSGetters &
  StatisticsGetters &
  SettingsGetters &
  NewsGetters
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key')

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    modules: {
      ddos,
      statistics,
      settings,
      news
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING
  })

  return Store
})

export function useStore () {
  return vuexUseStore(storeKey)
}
