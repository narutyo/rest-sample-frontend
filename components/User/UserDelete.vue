<template>
  <v-dialog
    v-model="isAddOpen"
    persistent
    max-width="640px"
  >
    <template #activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs" />
    </template>
    <div class="mb-2 mb-md-3 text-right">
      <v-btn
        aria-label="閉じる"
        fab
        small
        @click="close()"
      >
        <v-icon
          small
        >mdi-close</v-icon>
      </v-btn>
    </div>
    <v-card
      class="pt-6 pb-4 pb-md-8 px-4 px-md-12"
    >
      <div>
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="12"
          >
            <div>
              <v-text-field
                :value="user?.name"
                label="ユーザー名"
                readonly
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
      </div>
      <div
        class="text-center mt-4"
      >
        <v-btn
          outlined
          color="red accent-2"
          @click="destroy"
        >
          <v-icon>mdi-pencil</v-icon>
            削除
        </v-btn>
        <v-btn
        aria-label="閉じる"
        outlined
        @click="close"
      >
        <v-icon>mdi-close</v-icon>
        キャンセル
      </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  toRefs,
  useContext
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  setup (props, { emit }) {
    const { app } = useContext()
    const { user } = toRefs(props)

    const isAddOpen = ref(false)
    const loading = ref(false)

    const destroy = async () => {
      loading.value = true
      await app.$axios.$delete('/users/' + user.value.uuid).then((response) => {
        isAddOpen.value = false
        loading.value = false
        app.$toast.success('ユーザーを削除しました')
        emitReload()
      }).catch(() => {
        app.$toast.error('ユーザーの削除に失敗しました')
      })
    }

    const emitReload = () => {
      emit('reload')
    }

    const close = () => {
      isAddOpen.value = false
    }

    return {
      isAddOpen,
      loading,
      destroy,
      close
    }
  }
})
</script>
