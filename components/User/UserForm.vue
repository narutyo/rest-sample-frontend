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
              <div>
                <v-text-field
                  v-model="form.name"
                  label="名前"
                  :counter="40"
                  :rules="[rules.required, rules.name_length]"
                  :error="errors.name"
                  :error-messages="messages.name"
                  @keydown="clearError('name')"
                ></v-text-field>
              </div>
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="12"
            >
              <div>
                <v-text-field
                  v-model="form.email"
                  label="E-mail"
                  :counter="40"
                  :rules="[rules.required, rules.email_length]"
                  :error="errors.email"
                  :error-messages="messages.email"
                  @keydown="clearError('email')"
                ></v-text-field>
              </div>
              <div>
                <v-select
                  v-model="form.selected"
                  :items="company"
                  :menu-props="{ maxHeight: '400' }"
                  item-text="name"
                  item-value="uuid"
                  label="企業"
                  hint="所属企業を選択してください"
                  no-data-text="データがありません"
                  persistent-hint
                ></v-select>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div
        class="text-center mt-4"
      >
        <v-btn
          v-if="!user"
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
  onMounted,
  watch
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, { emit }) {
    const { app } = useContext()
    const { user } = toRefs(props)
    const company = ref([])

    // フォーム
    const observer = ref(null)

    const isAddOpen = ref(false)
    const form = ref({
      name: '',
      email: '',
      selected: ''
    })
    const loading = ref(false)

    // バリデーション
    const rules = ref({
      required: value => !!value || '必須項目です',
      name_length: value => (value && value.length <= 40) || '※40文字以内で入力してください',
      email_length: value => (value && value.length <= 255) || '※255文字以内で入力してください'
    })
    const errors = ref({
      name: false,
      email: false
    })
    const messages = ref({
      name: null,
      email: null
    })

    watch(() => isAddOpen.value,
      (to, from) => {
        if (to === true && user.value) {
          form.value.name = user.value.name
          form.value.email = user.value.email
          form.value.selected = user.value.company
        }
      },
      { immediate: true }
    )

    const getCompnay = async () => {
      company.value = []
      loading.value = true

      const paramJson = {
        'fields[]': app.$fetchFields.companyList
      }
      const companyRet = await app.$axios.$get('/company/master?' + app.$search_params(paramJson))
      company.value = companyRet.results.map(item => item)
      loading.value = false
    }

    const post = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$post('/users', {
          name: form.value.name,
          email: form.value.email,
          company_id: form.value.selected
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('アカウントを新規登録しました')
          emitReload()
        }).catch(() => {
          app.$toast.error('アカウントの新規登録に失敗しました')
        })
      }
    }
    const update = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$put('/users/' + user.value.uuid, {
          uuid: user.value.uuid,
          name: form.value.name,
          email: form.value.email,
          company_id: form.value.selected
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('アカウントを更新しました')
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

    onMounted(async () => {
      await getCompnay()
    })

    return {
      company,
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
