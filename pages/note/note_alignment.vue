<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          連携ノートマスタ
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <alignment-form
            @reload="getContents"
          >
            <template #default="slotProps">
              <v-btn
                v-bind="slotProps.attrs"
                class="ma-2"
                dark
                color="success"
                v-on="slotProps.on"
              >
                <v-icon>mdi-plus</v-icon>
                新しいノートを準備
              </v-btn>
            </template>
          </alignment-form>
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
                v-model="filter.name"
                :items="suggest.items"
                :loading="suggest.loading"
                hide-no-data
                hide-selected
                clearable
                label="登録名"
                maxlength="64"
                prepend-inner-icon="mdi-magnify"
                persistent-hint
                @update:search-input="getSuggest"
                @change="setFilter"
                @click:clear="setClearName"
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
          <template #[`item.open`]="{item}">
            <template
              v-if="item.note_uri"
            >
              <v-btn
                color="primary"
                dark
                icon
                @click="noteOpen(item)"
              >
                <v-icon>mdi-note-edit</v-icon>
              </v-btn>
            </template>
            <template v-else>
              <v-btn
                color="primary"
                dark
                icon
                @click="noteCreate(item)"
              >
                <v-icon>mdi-note-plus</v-icon>
              </v-btn>
            </template>
          </template>
          <template #[`item.edit`]="{item}">
            <alignment-form
              :note="item"
              @reload="getContents"
            >
              <template #default="slotProps">
                <v-btn
                  v-bind="slotProps.attrs"
                  color="success"
                  dark
                  icon
                  v-on="slotProps.on"
                >
                  <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
              </template>
            </alignment-form>
          </template>
          <template #[`item.delete`]="{item}">
            <alignment-delete
              :note="item"
              @reload="getContents"
            >
              <template #default="slotProps">
                <v-btn
                  v-bind="slotProps.attrs"
                  color="red"
                  dark
                  icon
                  v-on="slotProps.on"
                >
                  <v-icon>mdi-delete-forever</v-icon>
                </v-btn>
              </template>
            </alignment-delete>
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
import AlignmentForm from '~/components/Note/AlignmentForm.vue'
import AlignmentDelete from '~/components/Note/AlignmentDelete.vue'

export default defineComponent({
  name: 'SampleRssIndex',
  head: {
    title: '連携ノート一覧'
  },
  components: {
    AlignmentForm,
    AlignmentDelete
  },
  setup () {
    const { app, store, $config } = useContext()

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
      name: ''
    })
    const headers = ref([
      {
        text: 'ノート名',
        align: 'start',
        sortable: true,
        value: 'name'
      },
      { text: '登録日', value: 'created_at', width: '15%' },
      {
        text: '連携',
        align: 'start',
        sortable: false,
        value: 'open',
        width: '8%'
      },
      {
        text: '編集',
        align: 'start',
        sortable: false,
        value: 'edit',
        width: '8%'
      },
      {
        text: '削除',
        align: 'start',
        sortable: false,
        value: 'delete',
        width: '6%'
      }
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
        'fields[]': app.$fetchFields.noteAlignmentList,
        limit: limit.value,
        offset: (page.value - 1) * limit.value
      }
      if (filter.value.name) { paramJson.filter_name = filter.value.name }
      const ret = await app.$axios.$get('/note/alignment?' + app.$search_params(paramJson) + searthQuery.value)
      console.log(ret)
      totalCount.value = ret.metadata.resultset.count
      desserts.value = ret.results.map(item => item)
      loading.value = false
    }

    const setFilter = () => {
      updatePager(1)
    }
    const setClearName = () => {
      filter.name = ''
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
        'fields[]': ['name'],
        filter_name: str,
        limit: suggest.value.limit,
        sort: 'name',
        order: 'asc'
      }
      const ret = await app.$axios.$get('/note/alignment?' + app.$search_params(paramJson))
      suggest.value.items = ret.results.map(item => item.name)
      suggest.value.loading = false
    }
    const noteCreate = (item) => {
      const paramJson = {
        access_id: $config.accessKeyId,
        access_token: app.$auth.strategy.token.get(),
        template_id: item.note_template_master.template_id,
        folder_uri: item.note_template_master.folder_uri,
        internal_id: item.uuid,
        note_new_uri: $config.apiUrl + '/note/alignment/callback'
      }
      window.location.href = 'eyachoch6:///nsk/new?' + app.$search_params(paramJson)
    }
    const noteOpen = (item) => {
      const paramJson = {
        access_id: $config.accessKeyId,
        access_token: app.$auth.strategy.token.get(),
        note_uri: item.note_uri
      }
      window.location.href = 'eyachoch6:///nsk/open?' + app.$search_params(paramJson)
    }

    onMounted(async () => {
      await getContents()
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
      setClearName,
      updatePager,
      updateOptions,
      getSuggest,
      noteCreate,
      noteOpen
    }
  }
})
</script>
