<template>
  <v-dialog
    v-model="isAddOpen"
    persistent
    max-width="540px"
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
      <v-card-text class="d-flex align-start">
        <v-icon
          class="mr-2"
          color="danger"
        >
        mdi-delete-off
        </v-icon>
        <div>
          <h5 class="font-weight-bold body-1">
            登録データ一括削除
          </h5>
          <div class="mt-2">
            サーバーに送信された営業報告、および生成したサンプルデータを全て削除します。
          </div>
        </div>
      </v-card-text>
      <v-card-text>
        <div
          class="text-center"
        >
          <v-btn
            outlined
            color="danger"
            :loading="loading"
            @click="truncate"
          >
            <v-icon>mdi-delete-off-outline</v-icon>
            削除
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
  useContext
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BusinessReportTruncate',
  setup (props) {
    const { app } = useContext()
    const isAddOpen = ref(false)
    const loading = ref(false)

    const truncate = async () => {
      loading.value = true
      await app.$axios.$delete('/sample/business_report/truncate').then((response) => {
        isAddOpen.value = false
        loading.value = false
        app.$toast.success('営業報告を全削除しました')
      }).catch(() => {
        app.$toast.error('営業報告の削除処理に失敗しました')
      })
    }

    const close = () => {
      isAddOpen.value = false
    }

    return {
      isAddOpen,
      loading,
      truncate,
      close
    }
  }
})
</script>
