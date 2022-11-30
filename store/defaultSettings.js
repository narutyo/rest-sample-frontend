const state = () => ({
  limit: 10
})

const mutations = {
  setLimit (state, payload) {
    state.limit = payload
  }
}

const actions = {
  setLimit ({ commit }, payload) {
    commit('setLimit', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
