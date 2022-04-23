<template>
  <q-page class="row items-center justify-evenly bg-grey-10 text-white">
    <q-card class="bg-grey-10 full-card">
      <q-card-section>
        <div class="text-h4 text-center">{{ $t('bomber.header') }}</div>
        <div class="text-center text-grey-7">{{ $t('bomber.description') }}</div>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>{{ $t('bomber.running.title') }}</q-item-label>
            <q-item-label caption class="text-grey-7">{{ $t('bomber.running.caption') }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle color="green" v-model="autolaunch" val="friend"/>
          </q-item-section>
        </q-item>

        <q-input
          class=""
          filled
          v-model="phone"
          label="Phone"
          mask="+7 (###) ###-##-##"
          debounce="1000"
          square
          input-style="color: white;"
          hi
          label-color="white"
          color="white"
        />

        <div class="text-center q-mt-sm">{{$t('bomber.successFullAttacks')}}<font color="green">23</font>{{' ' + $t('bomber.failedAttacks')}}<font color="red">12</font></div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Bomber',
  setup () {
    const phone = ref('')
    const inform = ref(true)
    return { phone, inform }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 700pxa
</style>
