<template>
  <v-dialog
    v-model="isAddOpen"
    persistent
    max-width="940px"
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
        >
          mdi-close
        </v-icon>
      </v-btn>
    </div>
    <v-card
      class="pt-6 pb-4 px-4"
    >
      <div>
        <v-form
          ref="observer"
        >
          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="12"
            >
              <v-tabs
                v-model="formTab"
                align-with-title
              >
                <v-tabs-slider />
                <v-tab>必須項目</v-tab>
                <v-tab>連携値</v-tab>
                <v-tab>連携値（補足）</v-tab>
                <v-tab>レコードセット</v-tab>
              </v-tabs>
              <v-tabs-items v-model="formTab" class="iba-editor-visual">
                <v-tab-item>
                  <v-card
                    class="pt-6 pb-4 px-4"
                    min-height="300"
                  >
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="form.name"
                          label="テンプレート名"
                          :counter="60"
                          :rules="[rules.required, rules.length_60]"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-text-field
                          v-model="form.template_id"
                          label="テンプレートID"
                          hint="新規作成する帳票のノートテンプレートID"
                          :counter="255"
                          :rules="[rules.required, rules.length]"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-text-field
                          v-model="form.folder_uri"
                          label="保存先フォルダ"
                          hint="新規作成する帳票の保存先フォルダのURL"
                          :counter="255"
                          :rules="[rules.required, rules.length]"
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>

                <!-- 連携値 -->
                <v-tab-item>
                  <v-card
                    class="pt-6 pb-4 px-4"
                    min-height="300"
                  >
                    <v-row>
                      <v-col>
                        <v-data-table
                          :headers="paramsHeader"
                          :items="createParams"
                          :items-per-page="-1"
                          item-key="serial_number"
                          no-data-text="登録された連携値がありません"
                          class="elevation-1 table-one"
                          hide-default-footer
                        >
                          <template
                            v-if="createParams.length>0"
                            #body="{items}"
                          >
                            <draggable
                              v-model="createParams"
                              tag="tbody"
                              :options="{ handle:'.handle' }"
                              @end="sortParams('create', items)"
                            >
                              <tr v-for="item in items" :key="item.serial_number">
                                <td>
                                  <v-text-field
                                    v-model="item.name"
                                    prepend-icon="mdi-format-line-spacing"
                                    label="要素名"
                                    :counter="30"
                                    :rules="[rules.required, rules.length_30]"
                                    class="handle"
                                  />
                                </td>
                                <td>
                                  <v-checkbox
                                    v-for="(paramTarget, index) in $const.templateParamTarget"
                                    :key="index"
                                    v-model="item[paramTarget.value]"
                                    :label="paramTarget.text"
                                  />
                                </td>
                                <td>
                                  <v-select
                                    v-model="item.type"
                                    label="値種別"
                                    :full-width="false"
                                    :items="$const.templateParamType"
                                    :rules="[rules.required]"
                                  />
                                </td>
                                <td>
                                  <v-text-field
                                    v-if="item.type === 'manual'"
                                    v-model="item.value"
                                    label="値"
                                    :counter="30"
                                    :rules="[rules.length_30]"
                                  />
                                  <v-select
                                    v-else
                                    v-model="item.value"
                                    label="値"
                                    :full-width="false"
                                    :items="$const.templateSystemValue"
                                    :rules="[rules.required]"
                                  />
                                </td>
                                <td>
                                  <v-btn
                                    left
                                    icon
                                    color="red"
                                    @click="delParam('create', item.serial_number)"
                                  >
                                    <v-icon>mdi-delete-forever-outline</v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </draggable>
                          </template>
                          <template #footer>
                            <v-row>
                              <v-col
                                cols="12"
                                class="text-center"
                              >
                                <v-btn
                                  left
                                  outlined
                                  color="blue"
                                  @click="addParam('create')"
                                >
                                  <v-icon>mdi-plus</v-icon>
                                  追加
                                </v-btn>
                              </v-col>
                            </v-row>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>

                <!-- 連携値（補足） -->
                <v-tab-item>
                  <v-card
                    class="pt-6 pb-4 px-4"
                    min-height="300"
                  >
                    <v-row>
                      <v-col>
                        <v-data-table
                          :headers="paramsHeader"
                          :items="supplyParams"
                          :items-per-page="-1"
                          item-key="serial_number"
                          no-data-text="登録された連携値がありません"
                          class="elevation-1 table-one"
                          hide-default-footer
                        >
                          <template
                            v-if="supplyParams.length>0"
                            #body="{items}"
                          >
                            <draggable
                              v-model="supplyParams"
                              tag="tbody"
                              :options="{ handle:'.handle' }"
                              @end="sortParams('supply', items)"
                            >
                              <tr v-for="item in items" :key="item.serial_number">
                                <td>
                                  <v-text-field
                                    v-model="item.name"
                                    prepend-icon="mdi-format-line-spacing"
                                    label="要素名"
                                    :counter="30"
                                    :rules="[rules.required, rules.length_30]"
                                    class="handle"
                                  />
                                </td>
                                <td>
                                  <v-checkbox
                                    v-for="(paramTarget, index) in $const.templateParamTarget"
                                    :key="index"
                                    v-model="item[paramTarget.value]"
                                    :label="paramTarget.text"
                                  />
                                </td>
                                <td>
                                  <v-select
                                    v-model="item.type"
                                    label="値種別"
                                    :full-width="false"
                                    :items="$const.templateParamType"
                                    :rules="[rules.required]"
                                  />
                                </td>
                                <td>
                                  <v-text-field
                                    v-if="item.type === 'manual'"
                                    v-model="item.value"
                                    label="値"
                                    :counter="30"
                                    :rules="[rules.length_30]"
                                  />
                                  <v-select
                                    v-else
                                    v-model="item.value"
                                    label="値"
                                    :full-width="false"
                                    :items="$const.templateSystemValue"
                                    :rules="[rules.required]"
                                  />
                                </td>
                                <td>
                                  <v-btn
                                    left
                                    icon
                                    color="red"
                                    @click="delParam('supply', item.serial_number)"
                                  >
                                    <v-icon>mdi-delete-forever-outline</v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </draggable>
                          </template>
                          <template #footer>
                            <v-row>
                              <v-col
                                cols="12"
                                class="text-center"
                              >
                                <v-btn
                                  left
                                  outlined
                                  color="blue"
                                  @click="addParam('supply')"
                                >
                                  <v-icon>mdi-plus</v-icon>
                                  追加
                                </v-btn>
                              </v-col>
                            </v-row>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>

                <!-- レコードセット -->
                <v-tab-item>
                  <v-card
                    class="pt-6 pb-4 px-4"
                    min-height="300"
                  >
                    <v-row>
                      <v-col>
                        <v-select
                          v-model="form.recordset_model"
                          label="レコードセット返却対象モデル"
                          :full-width="false"
                          :items="$const.recordsetModels"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="form.recordset_page_template_id"
                          label="用紙テンプレートID"
                          hint="レコードセットを反映させる用紙テンプレートURI"
                          :counter="255"
                          :rules="[rules.length]"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="form.recordset_tagname_space"
                          label="タグネームスペース"
                          hint="レコードセットを反映させるタグネームスペース"
                          :counter="255"
                          :rules="[rules.length]"
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div
        class="text-center mt-4"
      >
        <v-btn
          v-if="!template"
          outlined
          @click="post()"
        >
          新規登録
        </v-btn>
        <v-btn
          v-else
          outlined
          @click="update()"
        >
          更新
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  toRefs,
  useContext,
  watch
} from '@nuxtjs/composition-api'
import draggable from 'vuedraggable'

export default defineComponent({
  components: {
    draggable
  },
  props: {
    template: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, { emit }) {
    const { app } = useContext()
    const { template } = toRefs(props)

    // フォーム
    const observer = ref(null)
    const formTab = ref(0)

    const isAddOpen = ref(false)
    const form = ref({
      name: '',
      template_id: '',
      folder_uri: '',
      recordset_model: '',
      recordset_tagname_space: ''
    })
    const recordsetModel = ref('')
    const loading = ref(false)
    // バリデーション
    const rules = ref({
      required: value => !!value || '必須項目です',
      length: value => (!value || (value && value.length <= 255)) || '※255文字以内で入力してください',
      length_60: value => (!value || (value && value.length <= 60)) || '※60文字以内で入力してください',
      length_30: value => (!value || (value && value.length <= 30)) || '※30文字以内で入力してください'
    })

    const createParams = ref([])
    const supplyParams = ref([])

    const paramsHeader = ref([
      {
        text: 'タグパラメータ',
        align: 'start',
        sortable: false,
        value: 'name',
        width: '30%'
      },
      {
        text: '対象',
        sortable: false,
        value: 'target',
        width: '20%'
      },
      {
        text: '値種別',
        sortable: false,
        value: 'type',
        width: '20%'
      },
      {
        text: '値',
        sortable: false,
        value: 'value',
        width: '30%'
      },
      {
        text: '',
        sortable: false,
        value: 'delete',
        width: '3%'
      }
    ])

    watch(() => isAddOpen.value,
      (to, from) => {
        if (to === true && template.value) {
          form.value.name = template.value.name
          form.value.template_id = template.value.template_id
          form.value.folder_uri = template.value.folder_uri
          form.value.recordset_model = template.value.recordset_model
          form.value.recordset_page_template_id = template.value.recordset_page_template_id
          form.value.recordset_tagname_space = template.value.recordset_tagname_space
          createParams.value = template.value.note_template_tag_params.map((item) => {
            return (item.sequence === 'create') ? item : null
          }).filter(v => v)
          supplyParams.value = template.value.note_template_tag_params.map((item) => {
            return (item.sequence === 'supply') ? item : null
          }).filter(v => v)
        } else {
          createParams.value = []
          supplyParams.value = []
        }
      },
      { immediate: true }
    )

    const postParams = computed(() => {
      return {
        name: form.value.name,
        template_id: form.value.template_id,
        folder_uri: form.value.folder_uri,
        recordset_model: form.value.recordset_model,
        recordset_page_template_id: form.value.recordset_page_template_id,
        recordset_tagname_space: form.value.recordset_tagname_space,
        createParams: createParams.value,
        supplyParams: supplyParams.value
      }
    })

    const post = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$post('/note/template', postParams.value).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('ノートテンプレートを新規登録しました')
          emitReload()
        }).catch(() => {
          app.$toast.error('ノートテンプレートの新規登録に失敗しました')
        })
      }
    }
    const update = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$put('/note/template/' + template.value.uuid, postParams.value).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('ノートテンプレートを更新しました')
          emitReload()
        }).catch(() => {
          app.$toast.error('ノートテンプレートの更新処理に失敗しました')
        })
      }
    }

    const emitReload = () => {
      emit('reload')
    }

    const addParam = (sequence) => {
      const tmp = {
        serial_number: (sequence === 'create') ? createParams.value.length : supplyParams.value.length,
        uuid: '',
        name: '',
        create: false,
        open: false,
        type: app.$const.templateParamType[0].value,
        value: ''
      }
      if (sequence === 'create') {
        createParams.value.push(tmp)
      } else {
        supplyParams.value.push(tmp)
      }
    }
    const delParam = (sequence, target) => {
      const orgParam = (sequence === 'create') ? createParams : supplyParams
      const tmp = []
      let index = 0
      orgParam.value.forEach((element) => {
        if (element.serial_number !== target) {
          tmp.push({
            serial_number: index,
            uuid: element.uuid,
            name: element.name,
            create: element.create,
            open: element.open,
            type: element.type,
            value: element.value
          })
          index++
        }
      })
      if (sequence === 'create') {
        createParams.value = tmp
      } else {
        supplyParams.value = tmp
      }
    }
    const sortParams = (sequence, items) => {
      let index = 0
      const tmp = []
      items.forEach((element) => {
        tmp.push({
          serial_number: index,
          uuid: element.uuid,
          name: element.name,
          create: element.create,
          open: element.open,
          type: element.type,
          value: element.value
        })
        index++
      })
      if (sequence === 'create') {
        createParams.value = tmp
      } else {
        supplyParams.value = tmp
      }
    }

    const close = () => {
      isAddOpen.value = false
      observer.value.reset()
    }

    return {
      observer,
      formTab,

      isAddOpen,
      form,
      loading,
      rules,

      createParams,
      supplyParams,
      recordsetModel,
      paramsHeader,

      post,
      update,
      sortParams,
      addParam,
      delParam,
      close
    }
  }
})
</script>
