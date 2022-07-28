<template>
  <q-page class="main-page q-pa-sm bg-grey-10">
    <div class="row q-gutter-sm">
      <div>
        <DDoS />
        <Settings class="q-mt-sm" />
      </div>
      <div class="col" style="min-width: 600px">
        <Session class="col" />
      </div>
      <div>
        <Statistics />
      </div>
    </div>

    <q-icon class="fixed-bottom-right q-mr-sm q-mb-sm" name="discord" size="40px">
      <q-menu class="discord-menu">
        {{ getLocalExternalIP }}
        <div>https://discord.gg/7BfJ9JKQ98</div>
      </q-menu>
    </q-icon>
    <UpdateModal />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DDoS from 'src/components/main/DDoS.vue'
import Settings from 'src/components/main/Settings.vue'
import Session from 'src/components/main/Session.vue'
import Statistics from 'src/components/main/Statistics.vue'
import UpdateModal from 'components/modals/UpdateModal.vue'

export default defineComponent({
  name: 'MainPage',

  components: {
    DDoS,
    Settings,
    Session,
    Statistics,
    UpdateModal
  }
})
</script>

<style lang="sass" scoped>
.main-page
  font-family: 'Inter'
  font-style: normal
  font-weight: 400
  color: #7B849C
</style>

<style lang="sass">
.help-icon
  color: #323741

.help-tooltip
  max-width: 200px
  color: #B0B8CC
  background: $light
  border: 1px solid $lighter

.discord-menu
  padding: 3px 6px
  overflow: hidden
  background: $light
  border: 1px solid $lighter
  color: #7B849C
</style>
