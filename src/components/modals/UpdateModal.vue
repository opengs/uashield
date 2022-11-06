<template>
  <q-dialog v-model="updateDialog" persistent>
    <q-card>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
        </q-avatar>

        <q-toolbar-title>{{ $t('main.ddos.update.title') }}</q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        {{ updateMessage }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('main.ddos.update.cancel')" color="blue" v-close-popup />
        <q-btn flat :label="$t('main.ddos.update.confirm')" color="blue" v-close-popup @click="confirmInstallUpdate"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  mounted () {
    try {
      window.require('electron').ipcRenderer.on('update', this.askForInstallUpdate.bind(this))
    } catch {}
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

  setup () {
    return {
      updateDialog: ref(false),
      updateMessage: ref('message')
    }
  }
})
</script>
