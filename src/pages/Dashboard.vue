<template>
  <q-page class="bg-grey-10 text-white fit">
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="bg-grey-10">
          <q-card-section class="bg-grey-10 text-white">
            <div class="row">
              <div class="col-10">
                <div class="text-h6">{{ $t('dashboard.rank.header') }}</div>
                <div class="text-h5">{{ $t('statistics.rank.level.' + $store.getters['statistics/rank'] ) }}</div>
              </div>
              <div class="col-2">
                <q-icon size="62px" name="leaderboard"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="bg-grey-10">
          <q-card-section class="bg-grey-10 text-white">
            <div class="row">
              <div class="col-10">
                <div class="text-h6">{{ $t('dashboard.totalDDoSAtacks.header') }}</div>
                <div class="text-h5">{{ $store.getters['statistics/ddosAllTimeSuccessfullRequests'] + $store.getters['ddos/successfullRequestsInSessionNotInStatistics'] }} / {{ $store.getters['statistics/ddosAllTimeRequests'] + $store.getters['ddos/requestsInSessionNotInStatistics'] }}</div>
              </div>
              <div class="col-2">
                <q-icon size="62px" name="trending_up"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="bg-grey-10">
          <q-card-section class="bg-grey-10 text-white">
            <div class="row">
              <div class="col-10">
                <div class="text-h6">{{ $t('dashboard.currentWorkers.header') }}</div>
                <div class="text-h5">{{ $store.getters['ddos/workers'] }}</div>
              </div>
              <div class="col-2">
                <q-icon size="62px" name="dns"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <!-- <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="bg-grey-10">
          <q-card-section class="bg-grey-10 text-white">
            <div class="text-h6">{{ $t('dashboard.efficiency.header') }}</div>
          </q-card-section>
          <q-card-section>
            <Efficiency />
          </q-card-section>
        </q-card>
      </div> -->
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="bg-grey-10 fit">
          <q-card-section class="bg-grey-10 text-white">
            <div class="text-h6">{{ $t('dashboard.requestsPerMinute.header') }}</div>
          </q-card-section>
          <q-card-section>
            <RequestsPerMinute class="fit" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// import Efficiency from '../components/dashboard/Efficiency.vue'
import RequestsPerMinute from '../components/main/RequestsPerMinute.vue'

export default defineComponent({
  name: 'Dashboard',

  components: {
    // Efficiency,
    RequestsPerMinute
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 350px
</style>
