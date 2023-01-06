<template>
  <span>
    {{ user?.name }}
  </span>
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
