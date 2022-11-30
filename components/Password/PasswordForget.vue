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
                  v-model="form.email"
                  label="E-mail"
                  :counter="40"
                  :rules="[rules.required, rules.email_length, rules.email_check]"
                  :error="errors.email"
                  :error-messages="messages.email"
                  @keydown="clearError('email')"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div
        class="text-center mt-4"
      >
        <v-btn
          outlined
          @click="submit()"
        >リセットメール送信</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext,
  watch
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    const { app } = useContext()

    // フォーム
    const observer = ref(null)

    const isAddOpen = ref(false)
    const form = ref({
      email: ''
    })
    const loading = ref(false)
    // バリデーション
    const rules = ref({
      required: value => !!value || '必須項目です',
      email_length: value => (value && value.length <= 255) || '255文字以内で入力してください',
      email_check: value => (app.$email_check(value)) || '正しい形式で入力してください'
    })
    const errors = ref({
      email: ''
    })
    const messages = ref({
      email: ''
    })

    watch(() => isAddOpen.value,
      (to, from) => {
        if (to === true) {
          form.value.email = ''
        }
      },
      { immediate: true }
    )

    const submit = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$post('/password/forget', {
          email: form.value.email
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('パスワードリセットメールを送信しました')
        }).catch(() => {
          observer.value.reset()
        })
      }
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

      submit,
      close,
      clearError
    }
  }
})
</script>
