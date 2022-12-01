<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          RSSレコード一覧
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
        </v-card-title>

        <v-container fluid class="pa-1">
          <v-row class="px-2">
            <v-col
              cols="12"
              sm="12"
              md="6"
              class="pa-1"
            >
              <v-combobox
                v-model="filter.title"
                :items="suggest.items"
                :loading="suggest.loading"
                hide-no-data
                hide-selected
                clearable
                label="タイトル"
                maxlength="64"
                prepend-inner-icon="mdi-magnify"
                persistent-hint
                @update:search-input="getSuggest"
                @change="setFilter"
                @click:clear="setClearTitle"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-container>
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
          <template #[`item.created_at`]="{item}">
            <div class="d-flex align-center">
              {{ item.created_at|datetime_format }}
            </div>
          </template>

        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext,
  computed,
  onMounted
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SampleRssIndex',
  head: {
    title: 'RSSレコード一覧'
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
      title: ''
    })
    const headers = ref([
      {
        text: 'タイトル',
        align: 'start',
        sortable: true,
        value: 'title'
      },
      { text: '注目度', value: 'attention', width: '8%' },
      { text: '重要度', value: 'importance', width: '8%' },
      { text: '登録日', value: 'created_at', width: '15%' }
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
        'fields[]': ['title', 'attention', 'importance', 'created_at'],
        limit: limit.value,
        offset: (page.value - 1) * limit.value
      }
      if (filter.value.title) { paramJson.filter_title = filter.value.title }
      const ret = await app.$axios.$get('/sample/rss?' + app.$search_params(paramJson) + searthQuery.value)
      totalCount.value = ret.metadata.resultset.count
      desserts.value = ret.results.map(item => item)
      loading.value = false
    }

    const setFilter = () => {
      updatePager(1)
    }
    const setClearTitle = () => {
      filter.title = ''
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
    const getSuggest = async (str) => {
      if (!str) { return }
      suggest.value.loading = true
      suggest.value.items = []

      const paramJson = {
        'fields[]': ['title'],
        filter_title: str,
        limit: suggest.value.limit,
        sort: 'title',
        order: 'asc'
      }
      const ret = await app.$axios.$get('/sample/rss?' + app.$search_params(paramJson))
      suggest.value.items = ret.results.map(item => item.title)
      suggest.value.loading = false
    }

    onMounted(async () => {
      await getContents()
      // console.log(app.$auth.strategy.token.get())
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
      setFilter,
      setClearTitle,
      updatePager,
      updateOptions,
      getSuggest
    }
  }
})
</script>
