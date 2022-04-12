<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    @click="goToRoute"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label class="text-grey-7" caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: 'home'
    },

    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    async goToRoute () {
      await this.$router.push({ name: this.link })
    }
  }
})
</script>
