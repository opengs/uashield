<template>
  <q-card style="border-radius: 10px" class="q-py-md bg-primary full-card">
    <div class="q-px-md" style="font-size: 16px" v-text="$t('main.settings.title')" />
    <q-separator class="q-mt-sm q-mx-md" style="background: #323741" />
    <div class="q-px-md q-mt-sm" v-text="$t('main.settings.language')" />
    <LanguageSelect class="q-px-md q-my-sm" />

    <q-item dense class="q-px-md" v-for="item in getSettingsList()" :key="item.title" tag="label" v-ripple>
      <q-item-section>
        <q-item-label v-text="item.title" />
      </q-item-section>
      <q-item-section avatar>
        <div>
          <q-icon class="help-icon" size="16px" name="help_outline">
            <q-tooltip class="help-tooltip" anchor="center right" self="center left" :offset="[10, 10]">
              {{ item.description }}
            </q-tooltip>
          </q-icon>
          <q-toggle size="32px" color="light-blue-13" v-model="this[item.model]" />
        </div>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LanguageSelect from '../LanguageSelect.vue'

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
  },

  methods: {
    getSettingsList () {
      return [
        {
          title: this.$t('main.settings.autoLaunch.title'),
          description: this.$t('main.settings.autoLaunch.description'),
          model: 'autolaunch'
        },

        {
          title: this.$t('main.settings.logRequests.title'),
          description: this.$t('main.settings.logRequests.description'),
          model: 'logRequests'
        },

        {
          title: this.$t('main.settings.logTimestamp.title'),
          description: this.$t('main.settings.logTimestamp.description'),
          model: 'logTimestamp'
        },

        {
          title: this.$t('main.settings.autoUpdate.title'),
          description: this.$t('main.settings.autoUpdate.description'),
          model: 'autoUpdate'
        },

        {
          title: this.$t('main.settings.minimizeToTray.title'),
          description: this.$t('main.settings.minimizeToTray.description'),
          model: 'minimizeToTray'
        }
      ]
    }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  font-size: 13px
</style>
