import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'nuxt-ideabox',
    paths: [
      'defaultSettings'
    ]
  })(store)
}
