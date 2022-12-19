<template>
  <v-dialog
    v-model="isAddOpen"
    persistent
    max-width="640px"
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
              <v-text-field
                v-model="form.name"
                label="判別名"
                :counter="255"
                :rules="[rules.required, rules.length]"
                :error="errors.name"
                :error-messages="messages.name"
                @keydown="clearError('name')"
              ></v-text-field>
            </v-col>
            <v-col
              v-if="!note"
              cols="12"
              sm="12"
              md="12"
            >
              <v-select
                v-model="form.note_template_master_id"
                :items="templateMasters"
                :menu-props="{ maxHeight: '400' }"
                label="ノートテンプレート"
                hint="ノートテンプレートを選択してください"
                no-data-text="データがありません"
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
          v-if="!note"
          outlined
          @click="post()"
        >新規登録</v-btn>
        <v-btn
          v-else
          outlined
          @click="update()"
        >更新</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  toRefs,
  useContext,
  watch
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    note: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, { emit }) {
    const { app } = useContext()
    const { note } = toRefs(props)

    // フォーム
    const observer = ref(null)

    const isAddOpen = ref(false)
    const form = ref({
      name: '',
      note_template_master_id: ''
    })
    const templateMasters = ref([])
    const loading = ref(false)
    // バリデーション
    const rules = ref({
      required: value => !!value || '必須項目です',
      length: value => (value && value.length <= 255) || '※60文字以内で入力してください'
    })
    const errors = ref({
      name: false,
      note_template_master_id: false
    })
    const messages = ref({
      name: null,
      note_template_master_id: null
    })

    watch(() => isAddOpen.value,
      async (to, from) => {
        if (to === true) {
          if (note.value) {
            form.value.name = note.value.name
          } else {
            const paramJson = {
              'fields[]': ['uuid', 'name'],
              sort: 'name',
              order: 'asc'
            }
            const ret = await app.$axios.$get('/note/template?' + app.$search_params(paramJson))
            templateMasters.value = ret.results.map((item) => {
              return {
                value: item.uuid,
                text: item.name
              }
            })
          }
        }
      },
      { immediate: true }
    )
    const post = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$post('/note/alignment', {
          name: form.value.name,
          note_template_master_id: form.value.note_template_master_id
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('連携ノートを新規登録しました')
          emitReload()
        }).catch(() => {
          app.$toast.error('連携ノートの新規登録に失敗しました')
        })
      }
    }
    const update = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$put('/note/alignment/' + note.value.uuid, {
          name: form.value.name
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('連携ノートを更新しました')
          emitReload()
        }).catch(() => {
          app.$toast.error('連携ノートの更新処理に失敗しました')
        })
      }
    }

    const emitReload = () => {
      emit('reload')
    }

    const close = () => {
      isAddOpen.value = false
      observer.value.reset()
      const formKeys = Object.keys(errors.value)
      formKeys.forEach(element => clearError(element))
    }
    const clearError = (item) => {
      errors.value[item] = false
      messages.value[item] = null
    }

    return {
      observer,

      isAddOpen,
      templateMasters,
      form,
      loading,
      rules,
      errors,
      messages,

      post,
      update,
      close,
      clearError
    }
  }
})
</script>
