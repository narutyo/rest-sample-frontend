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
                ></v-text-field>
              </div>
              <div>
                <v-text-field
                  v-model="form.identification_code"
                  label="社員番号"
                  :counter="10"
                  :rules="[rules.required, rules.id_length]"
                ></v-text-field>
              </div>
              <div v-if="!user">
                <v-text-field
                  v-model="form.password"
                  label="パスワード"
                  :counter="20"
                  :rules="[rules.required, rules.pw_length]"
                  :type="show ? 'text' : 'password'"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show = !show"
                ></v-text-field>
              </div>
              <div>
                <v-checkbox
                  v-model="form.admin_flg"
                  label="管理者権限を付与"
                ></v-checkbox>
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
          @click="post"
        >新規登録</v-btn>
        <v-btn
          v-else
          outlined
          @click="update"
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
    user: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, { emit }) {
    const { app } = useContext()
    const { user } = toRefs(props)

    // フォーム
    const observer = ref(null)

    const isAddOpen = ref(false)
    const form = ref({
      name: '',
      identification_code: '',
      password: '',
      admin_flg: 0
    })
    const show = ref(false)
    const loading = ref(false)

    // バリデーション
    const rules = ref({
      required: value => !!value || '必須項目です',
      name_length: value => (value && value.length <= 40) || '※40文字以内で入力してください',
      pw_length: value => (value && value.length <= 20) || '※20文字以内で入力してください',
      id_length: value => (value && value.length <= 10) || '※10文字以内で入力してください'
    })

    watch(() => isAddOpen.value,
      (to, from) => {
        if (to === true && user.value) {
          form.value.name = user.value.name
          form.value.identification_code = user.value.identification_code
          form.value.admin_flg = user.value.admin_flg
          form.value.password = null
        }
      },
      { immediate: true }
    )

    const post = async () => {
      if (observer.value.validate()) {
        loading.value = true
        await app.$axios.$post('/users', {
          name: form.value.name,
          identification_code: form.value.identification_code,
          password: form.value.password,
          admin_flg: form.value.admin_flg
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('ユーザーを新規登録しました')
          emitReload()
        }).catch(() => {
          app.$toast.error('ユーザーの新規登録に失敗しました')
        })
      }
    }
    const update = async () => {
      loading.value = true
      if (observer.value.validate()) {
        await app.$axios.$put('/users/' + user.value.uuid, {
          name: form.value.name,
          identification_code: form.value.identification_code,
          admin_flg: form.value.admin_flg
        }).then((response) => {
          isAddOpen.value = false
          observer.value.reset()
          loading.value = false
          app.$toast.success('ユーザーを更新しました')
          emitReload()
        }).catch(() => {
          app.$toast.error('ユーザーの更新処理に失敗しました')
        })
      }
    }
    const emitReload = () => {
      emit('reload')
    }

    const close = () => {
      isAddOpen.value = false
      observer.value.reset()
    }

    return {
      observer,

      isAddOpen,
      form,
      show,
      loading,
      rules,

      post,
      update,
      close
    }
  }
})
</script>
