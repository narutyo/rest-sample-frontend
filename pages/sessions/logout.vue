<template>
  <v-container class="my-12">
    <div class="bg-loader">
      <div class="loader"></div>
    </div>
  </v-container>
</template>

<script>
import {
  defineComponent,
  useContext,
  onMounted
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SessionLogout',
  layout: 'empty',
  setup () {
    const { app } = useContext()

    onMounted(() => {
      app.$auth.logout()
    })
  }
})
</script>

<style lang="scss" scoped>
.bg-loader {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.1);
  .loader {
    content: '';
    border: 6px solid #fff; /* Light grey */
    border-top: 6px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1.2s linear infinite;
    z-index: 1000;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%)
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
