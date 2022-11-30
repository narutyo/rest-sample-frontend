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
                  v-model="form.current_password"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  name="input-10-2"
                  label="現在のパスワード"
                  :rules="[rules.required]"
                  :error="errors.current_password"
                  :error-messages="messages.current_password"
                  @click:append="show = !show"
                ></v-text-field>

                <v-text-field
                  v-model="form.password"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  name="input-10-2"
                  label="パスワード"
                  :rules="[rules.required, rules.check_password]"
                  :error="errors.password"
                  :error-messages="messages.password"
                  @click:append="show = !show"
                ></v-text-field>

                <v-text-field
                  v-model="form.password_confirmation"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  name="input-10-2"
                  label="パスワード（確認）"
                  :rules="[rules.required, rules.check_password]"
                  :error="errors.password_confirmation"
                  :error-messages="messages.password_confirmation"
                  @click:append="show = !show"
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
        >パスワード変更</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  watch,
  useContext
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    const { app } = useContext()

    // フォーム
    const observer = ref(null)

    const isAddOpen = ref(false)
    const show = ref(false)
    const form = ref({
      current_password: '',
      password: '',
      password_confirmation: ''
    })
    const loading = ref(false)

    // バリデーション
    const rules = ref({
      required: value => !!value || '必須項目です',
      check_password: value => (value && passwordValidator.value === true) || '入力されたパスワードが一致しません'
    })
    const errors = ref({
      current_password: false,
      password: false,
      password_confirmation: false
    })
    const messages = ref({
      current_password: null,
      password: null,
      password_confirmation: null
    })

    const passwordFilled = computed(() => {
      return (form.value.password !== '' && form.value.password_confirmation !== '')
    })
    const passwordValidator = computed(() => {
      return (passwordFilled.value === true && form.value.password === form.value.password_confirmation)
    })

    watch(() => isAddOpen.value,
      (to, from) => {
        if (to) {
          form.value.current_password = ''
          form.value.name = ''
          form.value.email = ''
        }
      },
      { immediate: true }
    )

    const submit = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$put('/password/change', {
          current_password: form.value.current_password,
          password: form.value.password,
          password_confirmation: form.value.password_confirmation
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('パスワードを変更しました')
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
      show,
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
