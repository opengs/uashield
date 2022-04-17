<template>
  <q-page class="row items-center justify-evenly bg-grey-10 text-white">
    <q-card class="bg-grey-10 full-card">
      <q-card-section class="q-gutter-md">
        <LanguageSelect />

        <!-- Auto launch -->
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t('settings.autoLaunch.title') }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ $t('settings.autoLaunch.caption') }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="green" v-model="autolaunch" val="friend"/>
          </q-item-section>
        </q-item>

        <!-- Write request log -->
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t('settings.logRequests.title') }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ $t('settings.logRequests.caption') }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="green" v-model="logRequests" val="friend"/>
          </q-item-section>
        </q-item>

        <!-- Write log timestamp -->
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t('settings.logTimestamps.title') }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ $t('settings.logTimestamps.caption') }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="green" v-model="logTimestamp" val="friend"/>
          </q-item-section>
        </q-item>

        <!-- Write auto update -->
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t('settings.autoUpdate.title') }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ $t('settings.autoUpdate.caption') }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="green" v-model="autoUpdate" val="friend"/>
          </q-item-section>
        </q-item>

        <!-- Write auto update -->
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t('settings.minimizeToTray.title') }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ $t('settings.minimizeToTray.caption') }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="green" v-model="minimizeToTray" val="friend"/>
          </q-item-section>
        </q-item>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LanguageSelect from '../components/LanguageSelect.vue'

export default defineComponent({
  name: 'Settings',

  components: { LanguageSelect },

  computed: {
    autolaunch: {
      get () { return this.$store.getters['settings/autoLaunch'] },
      async set (val) { await this.$store.dispatch('settings/setAutoLaunch', val) }
    },
    autoUpdate: {
      get () { return this.$store.getters['settings/autoUpdate'] },
      async set (val) { await this.$store.dispatch('settings/setAutoUpdate', val) }
    },
    minimizeToTray: {
      get () { return this.$store.getters['settings/minimizeToTray'] },
      async set (val) { await this.$store.dispatch('settings/setMinimizeToTray', val) }
    },
    logRequests: {
      get () { return this.$store.getters['settings/logRequests'] },
      async set (val) { await this.$store.dispatch('settings/setLogRequests', val) }
    },
    logTimestamp: {
      get () { return this.$store.getters['settings/logTimestamp'] },
      async set (val) { await this.$store.dispatch('settings/setLogTimestamp', val) }
    }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 700pxa
</style>
