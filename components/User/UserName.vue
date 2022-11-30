<template>
  <nuxt-link
    :to="{ path: '/users/detail/' + user.uuid }"
  >
    {{user.name}}
  </nuxt-link>
</template>

<script>
import {
  defineComponent
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  }
})
</script>

<style>
.link {
  color: #fff;
}
</style>
