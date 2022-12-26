<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="label"
        hide-details="auto"
        readonly
        v-bind="attrs"
        v-on="on"
        @keydown.enter="menu = !menu"
      >
        <v-icon
          slot="append"
          small
        >fas fa-calendar-alt</v-icon>
      </v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :day-format="date => new Date(date).getDate()"
      :max="maxDate"
      @change="save"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import {
  defineComponent,
  ref,
  toRefs
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    label: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      default: ''
    },
    maxDate: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const menu = ref(false)
    const date = ref(null)
    const { target } = toRefs(props)

    const save = (date) => {
      emit('set-date', target.value, date)
    }

    return {
      menu,
      date,
      save
    }
  }
})
</script>
