<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-text class="text-center">
          <h6
            class="text--disabled font-weight-medium mb-10"
            v-text="$config.siteTitle"
          />
          <v-text-field
            v-model="login.identification_code"
            label="社員番号"
          />

          <v-text-field
            v-model="login.password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            name="input-10-2"
            label="パスワード"
            @click:append="show = !show"
          />

          <v-btn
            class="mb-4"
            color="primary"
            block
            dark
            @click="userLogin"
          >
            ログイン
          </v-btn>
          <div class="d-flex justify-around flex-wrap">
            <password-forget>
              <template #default="slotProps">
                <v-btn
                  class="mb-2"
                  color="primary"
                  text
                  small
                  v-bind="slotProps.attrs"
                  v-on="slotProps.on"
                >
                  パスワードを忘れた方はこちら
                </v-btn>
              </template>
            </password-forget>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext,
  useRouter
} from '@nuxtjs/composition-api'
import PasswordForget from '~/components/Password/PasswordForget.vue'

export default defineComponent({
  name: 'SessionLogin',
  components: {
    PasswordForget
  },
  layout: 'Session',
  setup () {
    const { app } = useContext()
    const router = useRouter()

    const show = ref(false)
    const login = ref({
      identification_code: '',
      password: ''
    })

    const userLogin = async () => {
      try {
        const param = {
          grant_type: 'password',
          client_id: app.$config.clientId,
          client_secret: app.$config.clientSecret,
          username: login.value.identification_code,
          password: login.value.password,
          scope: ''
        }
        await app.$auth.loginWith('local', { data: param })
        router.push({ path: '/' })
      } catch (error) {
        // app.$captureError(error)
      }
    }

    return {
      show,
      login,

      userLogin
    }
  },
  head: {
    title: 'ログイン'
  }
})
</script>
