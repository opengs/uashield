<template>
  <q-page class="row items-center justify-evenly bg-grey-10 text-white">
    <q-card class="bg-grey-10 full-card">
      <q-card-section>
        <div class="text-h4 text-center">{{ $t('ddos.counter.atackedTimes') }}</div>
        <div class="text-h1 text-center">{{ atackCounter }}</div>
        <div class="text-h5 text-center">{{ $t('ddos.counter.currentTarget') + currentAtack }}</div>
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
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { ipcRenderer, IpcRendererEvent } from 'electron'

export default defineComponent({
  name: 'PageIndex',

  methods: {
    serveAtack (_event: unknown, data: { url: string, log: string }) {
      this.currentAtack = data.url
      this.atackCounter += 1
      if (this.log.length > 100) this.log.pop()
      this.log.unshift(data.log)
    }
  },

  mounted () {
    window.require('electron').ipcRenderer.on('atack', this.serveAtack.bind(this))
  },

  setup () {
    const ddosEnabled = ref(true)
    const forceProxy = ref(false)
    const atackCounter = ref(0)
    const currentAtack = ref('')
    const log = ref([] as Array<string>)
    return { ddosEnabled, forceProxy, atackCounter, currentAtack, log }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 700px
</style>
