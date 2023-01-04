<template>
  <v-container fluid class="pa-1">
    <v-row class="px-2">
      <v-col
        cols="4"
        sm="3"
        md="2"
        class="pa-1"
      >
        <month-picker
          label="集計対象月"
          target="period"
          attach-dom="month"
          @set-date="setFilter"
        ></month-picker>
      </v-col>
      <v-col
        cols="8"
        sm="9"
        md="10"
        class="text-right"
      >
        <v-btn
          class="ma-2"
          dark
          color="primary"
          :disabled="filter.period==''"
          @click="getContents"
        >
          <v-icon>mdi-calculator-variant</v-icon>
          集計
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <line-chart
          :chart-data="datasets"
          :options="options"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext
} from '@nuxtjs/composition-api'
import MonthPicker from '~/components/Common/MonthPicker.vue'
import LineChart from '~/components/Chart/LineChart.vue'

export default defineComponent({
  name: 'SampleBusinessReportList',
  components: {
    MonthPicker,
    LineChart
  },
  setup () {
    const { app } = useContext()
    const datasets = ref({
      labels: [],
      datasets: []
    })
    const options = ref({
      responsive: true,
      scales: {
        r: {
          pointLabels: {
            display: true,
            centerPointLabels: true,
            font: {
              size: 18
            }
          }
        }
      }
    })

    const filter = ref({
      period: ''
    })

    const getContents = async () => {
      const ret = await app.$axios.$get('/sample/business_report/aggregate?period=' + filter.value.period)
      if (ret.metadata.resultset.count > 0) {
        datasets.value.labels = Object.keys(ret.results[Object.keys(ret.results)[0]])
        datasets.value.datasets = Object.keys(ret.results).map((item) => {
          return {
            label: item,
            data: Object.values(ret.results[item])
          }
        })
      }
    }

    const setFilter = (target, val) => {
      filter.value[target] = val
    }

    return {
      filter,
      datasets,
      options,

      getContents,
      setFilter
    }
  }
})
</script>
