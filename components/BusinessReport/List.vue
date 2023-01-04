<template>
  <v-container fluid class="pa-1">
    <v-row class="px-2">
      <v-col
        cols="4"
        sm="3"
        md="2"
        class="pa-1"
      >
        <v-text-field
          v-model="filter.reportId"
          label="ID"
          hide-details="auto"
          clearable
          @click:clear="clear('reportId')"
          @blur="updatePager(1)"
          @keydown.enter="updatePager(1)"
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="4"
        sm="3"
        md="2"
        class="pa-1"
      >
        <date-picker
          label="訪問日（下限）"
          target="startDate"
          attach-dom="start-date-btn-nav"
          @set-date="setFilter"
        ></date-picker>
      </v-col>
      <v-col
        cols="4"
        sm="3"
        md="2"
        class="pa-1"
      >
        <date-picker
          label="訪問日（上限）"
          target="endDate"
          attach-dom="end-date-btn-nav"
          @set-date="setFilter"
        ></date-picker>
      </v-col>
      <v-col
        cols="4"
        sm="3"
        md="2"
        class="pa-1"
      >
        <v-combobox
          v-model="filter.name"
          :items="suggest.items"
          :loading="suggest.loading"
          hide-no-data
          hide-selected
          clearable
          label="報告者"
          maxlength="64"
          prepend-inner-icon="mdi-magnify"
          persistent-hint
          @update:search-input="getSuggest"
          @change="updatePager(1)"
          @click:clear="clear('name')"
        ></v-combobox>
      </v-col>
      <v-col>
        <business-report-generate-sample>
          <template #default="slotProps">
            <v-btn
              v-bind="slotProps.attrs"
              class="ma-2"
              dark
              color="success"
              v-on="slotProps.on"
            >
              <v-icon>mdi-plus</v-icon>
              サンプルデータ生成
            </v-btn>
          </template>
        </business-report-generate-sample>
        <business-report-truncate>
          <template #default="slotProps">
            <v-btn
              v-bind="slotProps.attrs"
              class="ma-2"
              dark
              color="danger"
              v-on="slotProps.on"
            >
              <v-icon>mdi-delete-off</v-icon>
              全削除
            </v-btn>
          </template>
        </business-report-truncate>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :loading="loading"
          :options="{
            page: page,
            itemsPerPage: limit,
          }"
          :headers="headers"
          :items="desserts"
          :server-items-length="totalCount"
          :footer-props = "{
            'items-per-page-text' : '表示件数:',
            'items-per-page-options': $const.itemsPerPageOptions
          }"
          loading-text="読み込み中..."
          no-data-text="データがありません"
          item-key="id"
          class="elevation-1 table-one"
          @update:options="updateOptions"
        >
          <template #[`item.visitDateTime`]="{item}">
            <div class="d-flex align-center">
              {{ item.visitDateTime|timestamp_to_datetime_format }}
            </div>
          </template>
          <template #[`item.updated_at`]="{item}">
            <div class="d-flex align-center">
              {{ item.updated_at|datetime_format }}
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext,
  computed,
  onMounted
} from '@nuxtjs/composition-api'
import DatePicker from '~/components/Common/DatePicker.vue'
import BusinessReportTruncate from '~/components/BusinessReport/Truncate.vue'
import BusinessReportGenerateSample from '~/components/BusinessReport/GenerateSample.vue'

export default defineComponent({
  name: 'SampleBusinessReportList',
  components: {
    DatePicker,
    BusinessReportTruncate,
    BusinessReportGenerateSample
  },
  setup () {
    const { app, store } = useContext()

    const loading = ref(false)
    const page = ref(1)
    const totalCount = ref(0)
    const searthQuery = ref('')
    const suggest = ref({
      loading: false,
      limit: 15,
      items: []
    })
    const filter = ref({
      reportId: '',
      startDate: '',
      endDate: '',
      name: ''
    })
    const headers = ref([
      {
        text: 'ID',
        align: 'start',
        sortable: true,
        value: 'reportId'
      },
      { text: '訪問日', value: 'visitDateTime', width: '20%' },
      { text: '訪問先', value: 'customer', width: '25%' },
      { text: '報告者', value: 'name', width: '15%' },
      { text: '更新日', value: 'updated_at', width: '20%' }
    ])
    const desserts = ref([])

    const limit = computed({
      get: () => store.state.defaultSettings.limit || 50,
      set: val => store.dispatch('defaultSettings/setLimit', val)
    })

    const getContents = async () => {
      desserts.value = []
      loading.value = true

      const paramJson = {
        'fields[]': [
          'reportId',
          'visitDateTime',
          'name',
          'customer',
          'updated_at'
        ],
        limit: limit.value,
        offset: (page.value - 1) * limit.value
      }
      if (filter.value.reportId) { paramJson.reportId = filter.value.reportId }
      if (filter.value.startDate) { paramJson.visit_start = filter.value.startDate }
      if (filter.value.endDate) { paramJson.visit_end = filter.value.endDate }
      if (filter.value.name) { paramJson.name = filter.value.name }
      const ret = await app.$axios.$get('/sample/business_report?' + app.$search_params(paramJson) + searthQuery.value)
      totalCount.value = ret.metadata.resultset.count
      desserts.value = ret.results.map(item => item)
      loading.value = false
    }

    const updatePager = (val) => {
      page.value = val
      getContents()
    }
    const updateOptions = (option) => {
      const sortByParam = (option.sortBy.length > 0) ? '&sort=' + option.sortBy[0] : ''
      const sortDescParam = (option.sortDesc.length > 0 && option.sortDesc[0] === true && sortByParam !== '') ? sortByParam + '&order=desc' : (sortByParam !== '') ? sortByParam + '&order=asc' : ''
      limit.value = option.itemsPerPage
      searthQuery.value = sortDescParam
      updatePager(option.page)
    }

    const setFilter = (target, val) => {
      filter.value[target] = val
      updatePager(1)
    }
    const clear = (target) => {
      filter.value[target] = null
      updatePager(1)
    }

    const getSuggest = async (str) => {
      if (!str) { return }
      suggest.value.loading = true
      suggest.value.items = []

      const paramJson = {
        'fields[]': ['name'],
        filter_name: str,
        limit: suggest.value.limit,
        sort: 'name',
        order: 'asc'
      }
      const ret = await app.$axios.$get('/sample/business_report/suggest?' + app.$search_params(paramJson))
      suggest.value.items = ret.results.map(item => item.name)
      suggest.value.loading = false
    }

    onMounted(async () => {
      await getContents()

      app.$pusher_channel('SampleBusinessReport', function () {
        updatePager(1)
      })
    })

    return {
      loading,
      page,
      totalCount,
      searthQuery,
      suggest,
      filter,
      headers,
      desserts,
      limit,

      getContents,
      updatePager,
      updateOptions,
      setFilter,
      clear,
      getSuggest
    }
  }
})
</script>
