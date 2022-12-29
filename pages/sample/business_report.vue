<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          営業報告サンプル
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text>
          <v-tabs
            v-model="tab"
            align-with-title
          >
            <v-tabs-slider />
            <v-tab>日報一覧</v-tab>
            <v-tab>月報</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" class="iba-editor-visual">
            <v-tab-item>
              <business-report-list />
            </v-tab-item>
            <v-tab-item>
              <business-report-aggregate />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {
  defineComponent,
  ref
} from '@nuxtjs/composition-api'
import BusinessReportList from '~/components/BusinessReport/List.vue'
import BusinessReportAggregate from '~/components/BusinessReport/Aggregate.vue'

export default defineComponent({
  name: 'SampleBusinessReportIndex',
  components: {
    BusinessReportList,
    BusinessReportAggregate
  },
  head: {
    title: '営業報告一覧'
  },
  setup (props) {
    const tab = ref(0)
    return {
      tab
    }
  }
})
</script>
