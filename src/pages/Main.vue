<template>
  <q-page class="main-page q-pa-sm bg-grey-10">
    <div class="row">
      <div class="q-pa-sm col-xs-12 col-sm-3 col-md-2">
        <DDoS class="q-mt-sm"/>
        <Settings class="q-mt-sm" />
      </div>
      <div class="q-pa-sm col-xs-12 col-sm-9 col-md-6">
        <Session class="q-mt-sm"/>
      </div>
      <div class="q-pa-sm col-xs-12 col-sm-12 col-md-4">
        <Statistics class="q-mt-sm"/>
        <News class="q-mt-sm" />
      </div>
    </div>

    <q-icon class="fixed-bottom-right q-mr-sm q-mb-sm" name="telegram" size="40px">
      <q-menu class="telegram-menu">
        <div>https://t.me/uashield</div>
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
import News from 'src/components/main/News.vue'
import UpdateModal from 'components/modals/UpdateModal.vue'

export default defineComponent({
  name: 'MainPage',

  components: {
    DDoS,
    Settings,
    Session,
    Statistics,
    News,
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

.telegram-menu
  padding: 3px 6px
  overflow: hidden
  background: $light
  border: 1px solid $lighter
  color: #7B849C
</style>
