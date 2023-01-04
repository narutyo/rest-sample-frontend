<template>
  <v-dialog
    v-model="isAddOpen"
    persistent
    max-width="540px"
  >
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs" />
    </template>
    <div class="mb-2 mb-md-3 text-right">
      <v-btn
        aria-label="閉じる"
        fab
        small
        @click="close()"
      >
        <v-icon
          small
        >mdi-close</v-icon>
      </v-btn>
    </div>
    <v-card
      class="pt-6 pb-4 pb-md-8 px-4 px-md-12"
    >
      <v-card-text class="d-flex align-start">
        <v-icon
          class="mr-2"
          color="success"
        >
        mdi-expand-all
        </v-icon>
        <div>
          <h5 class="font-weight-bold body-1">
            サンプルデータ一括登録
          </h5>
          <div class="mt-2">
            ランダムに営業報告データを生成します。<br />
            生成する件数や条件を指定してください。
          </div>
        </div>
      </v-card-text>
      <v-card-text>
        <div>
          <v-form
            ref="observer"
            class="ib2-addidea"
          >
          <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-select
                  v-model="form.users"
                  :items="userList"
                  :rules="[rules.required]"
                  label="担当者"
                  hint="生成するサンプルデータの担当者を選択してください（複数選択可）"
                  persistent-hint
                  multiple
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-select
                  v-model="form.range"
                  :items="rangeList"
                  label="日付範囲"
                  hint="生成するサンプルデータの日付範囲を選択してください"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-select
                  v-model="form.count"
                  :items="countList"
                  label="生成する件数"
                  hint="生成するサンプルデータの件数を選択してください"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div
          class="text-center mt-4"
        >
          <v-btn
            outlined
            color="success"
            :loading="loading"
            @click="generate"
          >
            <v-icon>mdi-expand-all-outline</v-icon>
            一括生成
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  useContext
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BusinessReportGenerateSample',
  setup (props) {
    const { app } = useContext()
    const isAddOpen = ref(false)
    const loading = ref(false)

    // フォーム
    const observer = ref(null)
    const form = ref({
      users: [],
      range: 'month',
      count: 100
    })
    const userList = ref([])
    const rangeList = ref([
      { text: '1週間以内', value: 'week' },
      { text: '1ヵ月以内', value: 'month' },
      { text: '3ヵ月以内', value: 'quarter' },
      { text: '1年以内', value: 'year' }
    ])
    const countList = ref([
      { text: '10件', value: 10 },
      { text: '100件', value: 100 },
      { text: '200件', value: 200 }
    ])

    // バリデーション
    const rules = ref({
      required: value => value.length > 0 || '必須項目です'
    })

    const getUsers = async () => {
      const paramJson = {
        'fields[]': [
          'uuid',
          'name'
        ]
      }
      const ret = await app.$axios.$get('/users?' + app.$search_params(paramJson))
      userList.value = ret.results.map((item) => {
        return {
          text: item.name,
          value: item.uuid
        }
      })
    }

    const generate = async () => {
      if (observer.value.validate()) {
        loading.value = true
        await app.$axios.$post('/sample/business_report/generate', form.value).then((response) => {
          isAddOpen.value = false
          loading.value = false
          app.$toast.success('サンプルデータを一括生成しました')
        }).catch(() => {
          app.$toast.error('サンプルデータの一括生成処理に失敗しました')
        })
      }
    }

    const close = () => {
      isAddOpen.value = false
    }

    onMounted(async () => {
      await getUsers()
    })

    return {
      observer,

      isAddOpen,
      loading,
      form,
      userList,
      rangeList,
      countList,
      rules,

      generate,
      close
    }
  }
})
</script>
