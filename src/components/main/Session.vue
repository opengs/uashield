<template>
  <q-card style="border-radius: 10px" class="q-pa-md bg-primary full-card">
    <div v-text="$t('main.session.session')" />
    <div class="row q-px-lg">
      <q-item class="col" v-for="stat in statisticsList" :key="stat.name">
        <q-item-section style="min-width: 0" avatar>
          <q-icon :name="stat.icon" :color="stat.iconColor" />
        </q-item-section>

        <q-item-section>
          <q-item-label caption style="color: inherit" v-text="stat.name" />
          <div class="text-white" style="font-size: 14px" v-text="stat.value" />
        </q-item-section>
      </q-item>
    </div>

    <div class="q-mt-lg" v-text="$t('main.session.currentTarget')" />
    <div class="q-px-lg text-white" v-text="$store.getters['ddos/currentAttack']" />

    <div class="q-mt-lg" v-text="$t('main.session.requestsPerMinute')" />
    <div class="row justify-center">
      <RequestsPerMinute />
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RequestsPerMinute from 'components/main/RequestsPerMinute.vue'

export default defineComponent({
  name: 'SessionPage',

  components: { RequestsPerMinute },

  computed: {
    statisticsList () {
      return [
        {
          name: this.$t('main.session.timesAttacked'),
          icon: 'send',
          iconColor: 'blue',
          value: this.$store.getters['ddos/requestsInSessionNotInStatistics']
        },

        {
          name: this.$t('main.session.efficiency'),
          icon: 'flag',
          iconColor: 'green',
          value: `${(this.$store.getters['ddos/successfullRequestsInSessionNotInStatistics'] / this.$store.getters['ddos/requestsInSessionNotInStatistics'] * 100).toFixed(2)}%`
        },

        {
          name: this.$t('main.session.incomingTraffic'),
          icon: 'get_app',
          iconColor: 'orange',
          value: 'soon'
        },

        {
          name: this.$t('main.session.outgoingTraffic'),
          icon: 'upload',
          iconColor: 'purple',
          value: 'soon'
        }
      ]
    }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  font-size: 14px
</style>
