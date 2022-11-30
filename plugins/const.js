import Vue from 'vue'

export default ({ app }, inject) => {
  const constant = {
    itemsPerPageOptions: [20, 50]

  }

  Vue.prototype.$const = constant
  inject('const', constant)
}
