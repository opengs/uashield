<template>
  <q-card style="border-radius: 10px" class="q-pa-md bg-primary full-card">
    <q-list separator dark>
      <q-item class="q-px-none q-py-md" v-for="stat in statisticsList" :key="stat.name">
        <q-item-section style="min-width: 0" avatar>
          <q-icon :name="stat.icon" size="15px" style="color: #323741" />
        </q-item-section>

        <q-item-section>
          <q-item-label style="font-size: 9px; color: #7B869C" caption v-text="stat.name" />
          <div v-text="stat.value" />
        </q-item-section>

        <q-item-section style="min-width: 0" avatar v-if="stat.description">
          <q-icon class="help-icon" size="16px" name="help_outline">
            <q-tooltip class="help-tooltip" anchor="center right" self="center left" :offset="[10, 10]">
              {{ stat.description }}
            </q-tooltip>
            <q-menu class="statistics-menu">
              <q-list>
                <q-item dense v-for="i in 25" :key="i" :class=" i-1 == $store.getters['statistics/rank'] ? 'text-positive' : ''">
                  <q-item-section>
                    <q-item-label>{{ $t('main.statistics.rank.level.' + (i - 1) ) }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    {{ (i - 1) * 3000000 }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StatisticsComponent',

  computed: {
    statisticsList () {
      return [
        {
          name: this.$t('main.statistics.totalAttacks'),
          icon: 'send',
          value: this.$store.getters['statistics/ddosAllTimeRequests'] + this.$store.getters['ddos/requestsInSessionNotInStatistics']
        },
        {
          name: this.$t('main.statistics.rank.name'),
          description: this.$t('main.statistics.rank.description'),
          icon: 'emoji_events',
          value: this.$t(`main.statistics.rank.level.${this.$store.getters['statistics/rank']}`)
        },
        {
          name: this.$t('main.statistics.currentThreads'),
          icon: 'link',
          value: this.$store.getters['ddos/workers']
        }
      ]
    }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 100%
  min-width: 180px
  font-size: 13px
</style>

<style lang="sass">
.statistics-menu
  background: $light
  border: 1px solid $lighter
  color: #7B849C
</style>
