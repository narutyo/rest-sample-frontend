import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "server",
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s | ${process.env.TITLE}`,
    title: process.env.TITLE,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/axios.js',
    '~plugins/const.js',
    '~plugins/fetchFields.js',
    '~plugins/filter.js',
    '~plugins/utils.js',
    '~plugins/validator.js',
    '~plugins/sentry.js',
    '~plugins/pusherChannel.js',
    { src: '@/plugins/localStorage.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    'nuxt-webfontloader',
    'nuxt-interpolation',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/toast',
    '@nuxtjs/auth-next',
    '@nuxtjs/sentry',
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    defaultAssets: {
      font: false,
    },
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue,
          secondary: "#304156",
          success: colors.green,
          danger: colors.red,
          warning: colors.deepOrange,
          info: colors.indigo,

          dark: "#242939",

          background: "#f2f3f8"
        },
        dark: {
          primary: colors.blue,
          secondary: "#304156",
          success: colors.green,
          danger: colors.red,
          warning: colors.deepOrange,
          info: colors.indigo
        }
      }
    }
  },
  webfontloader: {
    google: {
      families: ['Archivo:400;500;600;700'],
    },
  },
  toast: {
    position: 'top-right',
    duration: 5000,
  },

  auth: {
    redirect: {
      login: '/sessions/login',
      logout: '/sessions/login',
      home: false,
    },
    strategies: {
      local: {
        token: {
          property: "access_token",
          global: true,
        },
        user: {
          property: "user",
        },
        endpoints: {
          login: { url: "/session/login", method: "post" },
          logout: { url: "/session/logout", method: "post" },
          user: { url: "/session/user", method: "get" },
        },
      },
    },
  },

  publicRuntimeConfig: {
    axios: {
      proxy: true,
    },
    proxy: {
      '/': process.env.API_URL_BROWSER,
    },
    homeUrl: process.env.HOME_URL,
    siteTitle: process.env.TITLE,
    accessKeyId: process.env.ACCESS_KEY_ID,
    apiUrl: process.env.API_URL_BROWSER,
    sentryDsn: process.env.SENTRY_DSN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    echoHost: process.env.ECHO_HOST,
    pusherKey: process.env.PUSHER_KEY,
    pusherCluster: process.env.PUSHER_CLUSTER,
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.API_URL
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
