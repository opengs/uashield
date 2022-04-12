<template>
  <VueApexChart
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VueApexChart from 'vue3-apexcharts'

export default defineComponent({
  name: 'Efficiency',
  components: { VueApexChart },

  computed: {
    chartOptions () {
      return {
        chart: {
          type: 'radialBar',
          height: 128,
          offsetX: 0
        },
        colors: ['#FCCF31', '#17ead9', '#f02fc2'],
        plotOptions: {
          radialBar: {
            inverseOrder: false,
            hollow: {
              margin: 5,
              size: '48%',
              background: 'transparent'
            },
            track: {
              show: true,
              background: '#40475D',
              strokeWidth: '10%',
              opacity: 1,
              margin: 3 // margin is in pixels
            }
          }
        },
        series: [71, 63],
        labels: [
          this.$t('dashboard.efficiency.allTimeEfficiency').toString(),
          this.$t('dashboard.efficiency.currentEfficiency').toString(),
          this.$t('dashboard.efficiency.workers').toString()
        ],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#F55555', '#6078ea', '#6094ea'],
            type: 'horizontal',
            shadeIntensity: 0.5,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        }
      }
    },
    series () {
      return [
        Math.round(this.$store.getters['statistics/ddosAllTimeSuccessRequestsRate'] * 100 + 1),
        Math.round(this.$store.getters['ddos/realtimeSuccessAtackRate'] * 100 + 1),
        Math.round(this.$store.getters['ddos/workersRate'] * 100 + 1)
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
