<template>
  <q-page class="row items-center justify-evenly bg-grey-10 text-white">
    <q-card class="bg-grey-10 full-card">
      <q-card-section>
        <div class="text-h4 text-center">{{ $t('statistics.rank.title') }}</div>
        <div class="text-center text-grey-7">{{ $t('statistics.rank.caption') }}</div>
        <q-item tag="label" v-ripple v-for="i in 25" :key="i" :class=" i-1 == $store.getters['statistics/rank'] ? 'bg-positive' : ''">
          <q-item-section>
            <q-item-label>{{ $t('statistics.rank.level.' + (i - 1) ) }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            {{ (i - 1) * 1100000 }}
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Statistics'
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 700px
</style>
