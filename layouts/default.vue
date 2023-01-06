<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <template
          v-for="(item, i) in items"
        >
          <v-list-item
            v-if="!item.admin || (item.admin && $auth.user.admin)"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            My Account
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list
        dense
        nav
      >
        <password-change>
          <template #default="slotProps">
            <v-list-item
              link
              v-bind="slotProps.attrs"
              v-on="slotProps.on"
            >
              <v-list-item-icon>
                <v-icon>mdi-lock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>パスワード変更</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </password-change>
        <v-list-item
          to="/sessions/logout"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-chart-bubble</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext
} from '@nuxtjs/composition-api'
import PasswordChange from '~/components/Password/PasswordChange.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    PasswordChange
  },
  middleware: 'auth',
  setup () {
    const { $config } = useContext()

    const clipped = ref(false)
    const drawer = ref(true)
    const fixed = ref(false)
    const items = ref([
      {
        icon: 'mdi-home',
        title: 'ホーム',
        to: '/',
        admin: false
      },
      {
        title: '営業報告',
        icon: 'mdi-newspaper-variant-multiple ',
        to: '/sample/business_report',
        admin: false
      },
      {
        title: '連携ノート管理',
        icon: 'mdi-note-plus-outline',
        to: '/note/note_alignment',
        admin: false
      },
      {
        title: 'テンプレートマスタ管理',
        icon: 'mdi-note-multiple-outline',
        to: '/note/template_master',
        admin: false
      },
      {
        title: 'ユーザー管理',
        icon: 'mdi-note-multiple-outline',
        to: '/user',
        admin: true
      },
      {
        icon: 'mdi-chart-bubble',
        title: 'ログアウト',
        to: '/sessions/logout',
        admin: false
      }
    ])
    const miniVariant = ref(false)
    const right = ref(true)
    const rightDrawer = ref(false)
    const title = ref($config.siteTitle)

    return {
      clipped,
      drawer,
      fixed,
      items,
      miniVariant,
      right,
      rightDrawer,
      title
    }
  }
})
</script>
