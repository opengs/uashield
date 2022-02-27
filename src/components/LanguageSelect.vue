<template>
  <q-select
    v-model="language"
    color="white"
    outlined
    :options="languages"
    :option-value="opt => opt.symbol"
    :option-label="opt => opt.name"
    :label="$t('language')"
    label-color="white"
    bg-color="grey-10"
    behavior="menu"
  >
    <template v-slot:prepend>
      <q-icon :name="language.icon" />
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label v-html="scope.opt.symbol" />
          <q-item-label caption v-text="scope.opt.name" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'

interface LanguageInterface {
  name: string,
  symbol: string,
  icon: string
}

const languages : LanguageInterface[] = [
  {
    name: 'Українська',
    symbol: 'ua-UA',
    icon: '🇺🇦'
  },
  {
    name: 'English',
    symbol: 'en-US',
    icon: '🇺🇸'
  },
  {
    name: 'Polski',
    symbol: 'pl-PL',
    icon: '🇵🇱'
  }
]

export default defineComponent({
  name: 'LanguageSelect',

  watch: {
    language () {
      this.$i18n.locale = this.language.symbol
    }
  },

  setup () {
    const language = ref<LanguageInterface>(languages[0])
    return { languages, language }
  }
})
</script>
