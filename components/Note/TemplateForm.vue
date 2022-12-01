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
                label="テンプレート名"
                :counter="255"
                :rules="[rules.required, rules.length]"
                :error="errors.name"
                :error-messages="messages.name"
                @keydown="clearError('name')"
              ></v-text-field>
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
                :error="errors.template_id"
                :error-messages="messages.template_id"
                @keydown="clearError('template_id')"
              ></v-text-field>
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
                :error="errors.folder_uri"
                :error-messages="messages.folder_uri"
                @keydown="clearError('folder_uri')"
              ></v-text-field>
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

    const isAddOpen = ref(false)
    const form = ref({
      name: '',
      template_id: '',
      folder_uri: ''
    })
    const loading = ref(false)
    // バリデーション
    const rules = ref({
      required: value => !!value || '必須項目です',
      length: value => (value && value.length <= 255) || '※60文字以内で入力してください'
    })
    const errors = ref({
      name: false,
      template_id: false,
      folder_uri: false
    })
    const messages = ref({
      name: null,
      template_id: null,
      folder_uri: null
    })

    watch(() => isAddOpen.value,
      (to, from) => {
        if (to === true && template.value) {
          form.value.name = template.value.name
          form.value.template_id = template.value.template_id
          form.value.folder_uri = template.value.folder_uri
        }
      },
      { immediate: true }
    )
    const post = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$post('/note/template', {
          name: form.value.name,
          template_id: form.value.template_id,
          folder_uri: form.value.folder_uri
        }).then((response) => {
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
        await app.$axios.$put('/note/template/' + template.value.uuid, {
          name: form.value.name,
          template_id: form.value.template_id,
          folder_uri: form.value.folder_uri
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('ノートテンプレートを更新しました')
          emitReload()
        }).catch(() => {
          app.$toast.error('アカウントの更新処理に失敗しました')
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
