<template>
  <VueApexChart
  class="text-black"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import dayjs from 'dayjs'

import { defineComponent } from 'vue'
import VueApexChart from 'vue3-apexcharts'
/*

*/

export default defineComponent({
  name: 'Efficiency',
  components: { VueApexChart },

  computed: {
    chartOptions () {
      return {
        chart: {
          id: 'realtime',
          type: 'bar',
          height: 350,
          offsetX: 0,
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          animations: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#21BA45', '#F2C037', '#C10015'],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        tooltip: {
          x: {
            formatter: function (val: Date) {
              return dayjs(val).format('HH:mm')
            }
          }
        },
        xaxis: {
          categories: this.$store.getters['statistics/ddosRequestsPerMinute'].map((r) => new Date(r.timestamp * 10 * 1000)),
          labels: {
            formatter: function () {
              return ''
            }
          },
          type: 'time'
        },
        legend: {
          show: false,
          position: 'left',
          offsetY: 40
        },
        fill: {
          type: 'fill'
        }
      }
    },
    series () {
      return [
        {
          name: this.$t('dashboard.requestsPerMinute.successfullRequest'),
          data: this.$store.getters['statistics/ddosSuccessfullRequestsPerMinute'].map((r) => r.count)
        },
        {
          name: this.$t('dashboard.requestsPerMinute.neutralRequests'),
          data: this.$store.getters['statistics/ddosNeutralRequestsPerMinute'].map((r) => r.count)
        },
        {
          name: this.$t('dashboard.requestsPerMinute.failedRequests'),
          data: this.$store.getters['statistics/ddosFailedRequestsPerMinute'].map((r) => r.count)
        }
      ]
    }
  }
})
</script>

<style lang="sass" scoped>
.full-card
  width: 80%
  max-width: 700px
</style>
