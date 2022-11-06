<template>
  <q-card style="border-radius: 10px" class="q-pa-md bg-primary full-card">
    <div class="row justify-between">
      <div v-text="$t('main.ddos.ip.name')" />
      <div v-text="$store.state.settings.ip + ' ' + $store.state.settings.countryCode" />
      <q-btn icon="cached" size="xs" round @click="$store.dispatch('settings/fetchIpAddress')"/>
      <!-- <q-btn size="xs" rounded v-text="$store.state.settings.countryCode" href="https://google.com" /> -->
    </div>

    <div class="q-mt-sm row justify-between items-center">
      <div class="text-white text-subtitle1" v-text="$t('main.ddos.enable.name')" />
      <div class="row items-center q-gutter-x-xs">
        <q-icon class="help-icon" size="16px" name="help_outline">
          <q-tooltip class="help-tooltip" anchor="center right" self="center left" :offset="[10, 10]">
            {{ $t('main.ddos.enable.description') }}
          </q-tooltip>
        </q-icon>
        <label class="switch">
          <input type="checkbox" :checked="enabled" @click="enabled = !enabled">
          <span class="slider" :data-value="enabled ? 'ON' : 'OFF'"></span>
        </label>
      </div>
    </div>

    <div class="q-mt-md row justify-between items-center">
      <div style="font-size: 13px" v-text="$t('main.ddos.proxy.name')" />
      <div>
        <q-icon class="help-icon" size="16px" name="help_outline">
          <q-tooltip class="help-tooltip" anchor="center right" self="center left" :offset="[10, 10]">
            {{ $t('main.ddos.proxy.description') }}
          </q-tooltip>
        </q-icon>
        <q-toggle size="32px" v-model="withProxy" color="light-blue-13" />
      </div>
    </div>

    <q-separator class="q-mt-xs" style="background: #323741" />

    <div class="q-mt-sm row justify-between items-center">
      <div style="font-size: 13px" v-text="$t('main.ddos.advanced.automaticMode.name')" />
      <div>
        <q-icon class="help-icon" size="16px" name="help_outline">
          <q-tooltip class="help-tooltip" anchor="center right" self="center left" :offset="[10, 10]">
            {{ $t('main.ddos.advanced.automaticMode.description') }}
          </q-tooltip>
        </q-icon>
        <q-toggle size="32px" v-model="automaticMode" color="light-blue-13" />
      </div>
    </div>

    <div class="q-mt-sm row justify-between items-center">
      <div style="font-size: 11px" v-text="$t('main.ddos.advanced.maxDosersCount.name')" />
      <div style="font-size: 11px" v-text="workersCount" />
    </div>
    <q-slider
      v-model.number="workersCount"
      :min="16"
      :max="maxWorkersCount"
      :step="1"
      color="light-blue-13"
      debounce="1000"
    />
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DDosComponent',

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
    }
  },

  mounted () {
    void this.$store.dispatch('settings/fetchIpAddress')
  }
})
</script>

<style lang="sass" scoped>
.full-card
  font-size: 12px

.switch
  position: relative
  display: inline-block
  width: 80px
  height: 30px

.switch input
  opacity: 0
  width: 0
  height: 0

.slider
  position: absolute
  cursor: pointer
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $grey-9
  -webkit-transition: .4s
  transition: .4s
  border-radius: 10px

.slider:before
  position: absolute
  content: attr(data-value)
  line-height: 24px
  text-align: center
  font-size: 10px
  height: 24px
  width: 35px
  left: 4px
  bottom: 3px
  background-color: white
  -webkit-transition: .4s
  transition: .4s
  border-radius: 8px

input:checked + .slider
  background: $secondary

input:checked + .slider:before
  -webkit-transform: translateX(36px)
  -ms-transform: translateX(36px)
  transform: translateX(36px)
  color: $secondary !important

</style>
