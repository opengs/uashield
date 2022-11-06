<template>
  <q-card style="border-radius: 10px" class="q-pa-md bg-primary full-card">
    <div class="text-white text-subtitle1" v-text="$t('main.news.news')" />
    <q-spinner v-if="!$store.getters['news/loaded']" />
    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 400px"
      id="scroll-area-with-virtual-scroll-1"
    >
      <q-virtual-scroll
        scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
        :items="$store.getters['news/news']"
        :virtual-scroll-item-size="32"
        separator
      >
        <template v-slot="{ item, index }">
          <q-item :key="index" dense>
            <q-item-section>
              <q-item-label class="text-white">{{ item.title  }}</q-item-label>
              <q-item-label caption class="text-grey">{{ item.content }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption class="text-white">{{ item.date }}</q-item-label>
              <q-icon :name="item.icon" :color="item.iconColor" />
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
        </template>
      </q-virtual-scroll>
    </q-scroll-area>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NewsComponent',

  data () {
    return {
      thumbStyle: {
        right: '5px',
        borderRadius: '8px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '14px',
        backgroundColor: '#027be3',
        width: '14px',
        opacity: 0.2,
        marginTop: '-3px',
        marginBottom: '-3px',
        paddingTop: '3px',
        paddingBottom: '3px'
      }
    }
  },

  mounted () {
    void this.$store.dispatch('news/load')
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 100%
  min-width: 180px
  font-size: 13px
</style>
