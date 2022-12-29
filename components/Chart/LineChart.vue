<script>
import { Line } from 'vue-chartjs'
import chartjsPluginColorschemes from 'chartjs-plugin-colorschemes'

export default {
  extends: Line,
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  watch: {
    chartData: {
      handler (to, from) {
        this.renderChart(to, this.options)
      },
      immediate: false,
      deep: true
    }
  }
}
</script>
