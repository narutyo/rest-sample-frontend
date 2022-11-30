<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>

<script>
import {
  defineComponent,
  ref,
  toRefs,
  useMeta
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head: {},
  setup (props) {
    const { error } = toRefs(props)
    const { meta } = useMeta()

    const pageNotFound = ref('404 Not Found')
    const otherError = ref('An error occurred')

    meta.value = [
      { title: error.statusCode === 404 ? pageNotFound : otherError }
    ]

    return {
      pageNotFound,
      otherError
    }
  }
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
