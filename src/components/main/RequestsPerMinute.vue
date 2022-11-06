<template>
  <VueApexChart
    class="full-card"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import dayjs from 'dayjs'

import { defineComponent } from 'vue'
import VueApexChart from 'vue3-apexcharts'

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
        colors: ['#6023FF', '#fff', '#BC39FF'],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 4
          }
        },
        tooltip: {
          style: {
            color: '#ccc'
          }
        },
        xaxis: {
          categories: this.$store.getters['statistics/ddosRequestsPerMinute'].map((r) => new Date(r.timestamp * 10 * 1000)),
          labels: {
            style: {
              colors: '#7B849C',
              fontSize: '10px'
            },
            formatter: function (val: Date) {
              const date = dayjs(val).format('HH:mm:ss')
              if (date.slice(-2) !== '00') return ''
              return date.slice(0, 5)
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
