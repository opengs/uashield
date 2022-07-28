<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  methods: {
    async loadStorage () {
      try {
        // User data
        const data = await window.require('electron').ipcRenderer.invoke('loadUserData') as string
        await this.$store.dispatch('ddos/loadFromUserData', data)
        await this.$store.dispatch('statistics/loadFromUserData', data)
        await this.$store.dispatch('settings/loadFromUserData', data)

        // Handle electron ddos
        window.require('electron').ipcRenderer.on('atack', (_event: unknown, data: unknown) => void this.$store.dispatch('ddos/handleAtack', data))
        window.require('electron').ipcRenderer.on('executorsCountUpdate', (_event: unknown, data: unknown) => void this.$store.dispatch('ddos/handleWorkersCountUpdate', data))

        // Hadle electron statistics
        window.require('electron').ipcRenderer.on('atack', (_event: unknown, data: unknown) => void this.$store.dispatch('statistics/handleAtack', data))
        window.require('electron').ipcRenderer.on('executorsCountUpdate', (_event: unknown, data: unknown) => void this.$store.dispatch('statistics/handleWorkersCountUpdate', data))
      } catch {}
    }
  },

  mounted () {
    void this.loadStorage()
  }
})
</script>
