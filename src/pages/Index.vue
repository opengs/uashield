<template>
  <q-page class="row items-center justify-evenly bg-grey-10 text-white">
    <q-card class="bg-grey-10 full-card">
      <q-card-section>
        <div class="text-h4 text-center">{{ $t('ddos.counter.attackedTimes') }}</div>
        <div class="text-h1 text-center">{{ attackCounter }}</div>
        <div class="text-h5 text-center">{{ $t('ddos.counter.currentTarget') }}</div>
        <div class="text-h5 text-center">{{ currentAttack }}</div>
      </q-card-section>
      <q-card-section>
        <q-linear-progress stripe size="18px" :value="realtimeSuccessAtackRate" track-color="green" color="green">
          <div class="absolute-full flex flex-center">
            <q-badge color="grey-10" text-color="white" :label="$t('ddos.efficiency')" />
          </div>
        </q-linear-progress>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2 text-grey-7">{{ $t('ddos.description') }}</div>
      </q-card-section>
      <q-card-section>
        <LanguageSelect />
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('ddos.enable.name') }}</q-item-label>
              <q-item-label caption class="text-grey-7">{{ $t('ddos.enable.description') }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-toggle color="green" v-model="ddosEnabled" val="friend" />
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>{{ $t('ddos.proxy.name') }}</q-item-label>
              <q-item-label caption class="text-grey-7">{{ $t('ddos.proxy.description') }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-toggle color="blue" v-model="forceProxy" val="picture" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2 text-grey-7">{{ $t('ddos.coordinators') }}</div>
      </q-card-section>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="settings" color="grey-9" @click="advancedSettingsDialog = true"/>
    </q-page-sticky>

    <q-dialog v-model="advancedSettingsDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('ddos.advanced.header') }}</div>
          <q-item-label caption class="text-grey-7">{{ $t('ddos.advanced.description') }}</q-item-label>
        </q-card-section>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t('ddos.advanced.automaticMode.name') }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ $t('ddos.advanced.automaticMode.description') }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="blue" v-model="automaticMode" val="picture" />
          </q-item-section>
        </q-item>
        <q-card-section class="q-pt-none" :disable="automaticMode">
          <div class="text-h7">{{ $t('ddos.advanced.masDosersCount.name') }}</div>
          <q-slider
            v-model="maxDosersCount"
            :min="16"
            :max="maxNumberOfWorkers"
            :step="16"
            color="light-green"
            :disable="automaticMode"
          />
          <div class="custom-max-dosers-count-wrapper">
            <q-input
              :model-value="maxDosersCount"
              type="number"
              :min="1"
              filled
              square
              required
              @update:modelValue="updateNumberOfWorkers"
              :disable="automaticMode"
            />
          </div>
          <q-item-label caption class="text-grey-7">{{ $t('ddos.advanced.masDosersCount.description') }}</q-item-label>
          <q-linear-progress stripe size="18px" :value="successfullAtackRate" track-color="green" color="green" class="q-mt-sm" >
            <div class="absolute-full flex flex-center">
              <q-badge color="grey-10" text-color="white" label="Success rate" />
            </div>
          </q-linear-progress>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" class="fit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
          <q-btn flat :label="$t('ddos.update.cancel')" color="primary" v-close-popup />
          <q-btn flat :label="$t('ddos.update.confirm')" color="primary" v-close-popup @click="confirmInstallUpdate"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import LanguageSelect from '../components/LanguageSelect.vue'
// import { ipcRenderer, IpcRendererEvent } from 'electron'

export default defineComponent({
  name: 'PageIndex',

  components: { LanguageSelect },

  computed: {
    maxNumberOfWorkers (): number {
      return Math.max(this.maxDosersCount, 256)
    },
    successfullAtackRate (): number {
      if (this.attackCounter === 0) return 1
      return Math.max(this.successfullAtacks / this.attackCounter, 0.1)
    },
    realtimeSuccessAtackRate (): number {
      if (this.realtimeAttackCounter < 1) return 1
      return Math.max(this.realtimeSuccessfullAtackCounter / this.realtimeAttackCounter * 1.2, 0.1)
    }
  },

  methods: {
    updateNumberOfWorkers (numberOfWorkers: number | undefined) {
      // When entering via input form it can be undefined
      if (numberOfWorkers !== undefined) {
        this.maxDosersCount = numberOfWorkers
      }
    },

    serveAttack (_event: unknown, data: { target: { page: string }, packetsSend: number, packetsSuccess: number }) {
      if ((new Date()).getTime() - this.lastAttackChange.getTime() > 1000) {
        this.currentAttack = data.target.page
        this.lastAttackChange = new Date()
      }
      this.attackCounter += data.packetsSend
      this.successfullAtacks += data.packetsSuccess

      this.realtimeAttackCounter += data.packetsSend
      this.realtimeSuccessfullAtackCounter += data.packetsSuccess
      if (this.realtimeAttackCounter > 1000) {
        this.realtimeAttackCounter /= 2
        this.realtimeSuccessfullAtackCounter /= 2
      }
    },

    serverExecutorsCountUpdate (_event: unknown, newCount: number) {
      this.maxDosersCount = newCount
    },

    askForInstallUpdate (_event: unknown, data: { message: string }) {
      this.updateDialog = true
      this.updateMessage = data.message
    },

    confirmInstallUpdate () {
      window.require('electron').ipcRenderer.send('installUpdate')
    }
  },

  watch: {
    ddosEnabled (newVal: boolean) {
      window.require('electron').ipcRenderer.send('updateDDOSEnable', { newVal })
    },
    forceProxy (newVal: boolean) {
      window.require('electron').ipcRenderer.send('updateForceProxy', { newVal })
    },
    maxDosersCount (newVal: number | undefined) {
      if (newVal !== undefined) {
        window.require('electron').ipcRenderer.send('updateMaxDosersCount', { newVal })
      }
    },
    automaticMode (newVal: boolean) {
      window.require('electron').ipcRenderer.send('updateStrategy', { newVal: newVal ? 'automatic' : 'manual' })
      this.maxDosersCount = 32
    }
  },

  mounted () {
    window.require('electron').ipcRenderer.on('atack', this.serveAttack.bind(this))
    window.require('electron').ipcRenderer.on('executorsCountUpdate', this.serverExecutorsCountUpdate.bind(this))
    window.require('electron').ipcRenderer.on('update', this.askForInstallUpdate.bind(this))
  },

  setup () {
    const ddosEnabled = ref(true)
    const forceProxy = ref(true)
    const attackCounter = ref(0)
    const successfullAtacks = ref(0)
    const realtimeAttackCounter = ref(0)
    const realtimeSuccessfullAtackCounter = ref(0)

    const currentAttack = ref('')
    const lastAttackChange = ref(new Date())

    const advancedSettingsDialog = ref(false)
    const automaticMode = ref(true)
    const maxDosersCount = ref(32)
    const updateDialog = ref(false)
    const updateMessage = ref('message')

    return { ddosEnabled, forceProxy, attackCounter, successfullAtacks, realtimeAttackCounter, realtimeSuccessfullAtackCounter, currentAttack, lastAttackChange, advancedSettingsDialog, automaticMode, maxDosersCount, updateDialog, updateMessage }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 700px
</style>
