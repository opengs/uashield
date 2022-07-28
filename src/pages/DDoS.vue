<template>
  <q-page class="row items-center justify-evenly bg-grey-10 text-white">
    <q-card class="bg-grey-10 full-card q-mt-md q-mb-md">
      <q-card-section>
        <div class="text-h4 text-center">{{ $t('ddos.counter.attackedTimes') }}</div>
        <div class="text-h1 text-center">{{ $store.getters['ddos/requestsInSession'] }}</div>
        <div class="text-h5 text-center">{{ $t('ddos.counter.currentTarget') }}</div>
        <div class="text-h5 text-center">{{ $store.getters['ddos/currentAttack'] }}</div>
      </q-card-section>
      <q-card-section>
        <q-linear-progress stripe size="18px" :value="$store.getters['ddos/realtimeSuccessAtackRate']" track-color="green" color="green">
          <div class="absolute-full flex flex-center">
            <q-badge color="grey-10" text-color="white" :label="$t('ddos.efficiency')" />
          </div>
        </q-linear-progress>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2 text-grey-7">{{ $t('ddos.description') }}</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('ddos.enable.name') }}</q-item-label>
              <q-item-label caption class="text-grey-7">{{ $t('ddos.enable.description') }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-toggle color="green" v-model="enabled" val="friend" />
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('ddos.proxy.name') }}</q-item-label>
              <q-item-label caption class="text-grey-7">{{ $t('ddos.proxy.description') }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-toggle color="blue" v-model="withProxy" val="picture" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">{{ $t('ddos.advanced.header') }}</div>
        <q-item-label caption class="text-grey-7">{{ $t('ddos.advanced.description') }}</q-item-label>
        <q-item tag="label" v-ripple class="q-mt-none">
          <q-item-section>
            <q-item-label>{{ $t('ddos.advanced.automaticMode.name') }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ $t('ddos.advanced.automaticMode.description') }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="automaticMode" val="picture" />
          </q-item-section>
        </q-item>
        <q-input
          v-model.number="maxWorkersCount"
          type="number"
          :label="$t('ddos.advanced.maxWorkersCount.name')"
          :min="16"
          debounce="1000"
          filled
          square
          required
          input-style="color: white;"
          hi
          label-color="white"
          color="white"
        />
        <div class="text-h7 q-mt-md">{{ $t('ddos.advanced.masDosersCount.name') }}</div>
        <q-slider
          v-model.number="workersCount"
          :min="16"
          :max="maxWorkersCount"
          :step="1"
          color="light-green"
          debounce="1000"
          label-always
          switch-label-side
          :marker-labels="workersSliderValues"
        />
        <q-item-label caption class="text-grey-7">{{ $t('ddos.advanced.masDosersCount.description') }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2 text-grey-7">{{ $t('ddos.coordinators') }}</div>
      </q-card-section>
    </q-card>

    <!--    Update dialog-->
    <q-dialog v-model="updateDialog" persistent>
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>

          <q-toolbar-title>{{ $t('ddos.update.title') }}</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          {{ updateMessage }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('ddos.update.cancel')" color="blue" v-close-popup />
          <q-btn flat :label="$t('ddos.update.confirm')" color="blue" v-close-popup @click="confirmInstallUpdate"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { ipcRenderer, IpcRendererEvent } from 'electron'

export default defineComponent({
  name: 'PageIndex',

  computed: {
    enabled: {
      get () { return this.$store.getters['ddos/enabled'] },
      async set (val: boolean) { await this.$store.dispatch('ddos/updateEnabled', val) }
    },
    withProxy: {
      get () { return this.$store.getters['ddos/withProxy'] },
      async set (val: boolean) { await this.$store.dispatch('ddos/updateWithProxy', val) }
    },
    automaticMode: {
      get () { return this.$store.getters['ddos/planer'] === 'automatic' },
      async set (val: boolean) { await this.$store.dispatch('ddos/updatePlaner', val ? 'automatic' : 'manual') }
    },
    workersCount: {
      get () { return this.$store.getters['ddos/workers'] },
      async set (val: boolean) { await this.$store.dispatch('ddos/updateWorkers', Number(val)) }
    },
    maxWorkersCount: {
      get () { return this.$store.getters['ddos/maxWorkers'] },
      async set (val: boolean) { await this.$store.dispatch('ddos/updateMaxWorkers', Number(val)) }
    },

    workersSliderValues () {
      const data = {} as {[key: number]: string}
      data[16] = '16'
      data[this.maxWorkersCount] = String(this.maxWorkersCount).toString()
      return data
    }
  },

  methods: {
    askForInstallUpdate (_event: unknown, data: { message: string }) {
      this.updateDialog = true
      this.updateMessage = data.message
    },

    confirmInstallUpdate () {
      window.require('electron').ipcRenderer.send('installUpdate')
    }
  },

  mounted () {
    window.require('electron').ipcRenderer.on('update', this.askForInstallUpdate.bind(this))
  },

  setup () {
    const updateDialog = ref(false)
    const updateMessage = ref('message')

    return { updateDialog, updateMessage }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 700px
</style>
