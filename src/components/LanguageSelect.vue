<template>
  <q-select
    v-model="language"
    color="secondary"
    dense
    rounded
    outlined
    dark
    :options="languages"
    :option-value="opt => opt.symbol"
    :option-label="opt => opt.name"
    options-selected-class="text-yellow"
    bg-color="blue-grey-10"
    behavior="menu"
  >
    <template v-slot:option="scope">
      <q-item class="menu-item" v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label caption v-text="scope.opt.name" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface LanguageInterface {
  name: string
  symbol: string
}

const languages : LanguageInterface[] = [
  {
    name: 'Українська',
    symbol: 'ua-UA'
  },
  {
    name: 'English',
    symbol: 'en-US'
  },
  {
    name: 'Español',
    symbol: 'es-ES'
  },
  {
    name: 'Polski',
    symbol: 'pl-PL'
  },
  {
    name: 'Lietuvių',
    symbol: 'lt-LT'
  },
  {
    name: 'Nederlandse',
    symbol: 'nl-NL'
  },
  {
    name: 'Český',
    symbol: 'cs-CS'
  },
  {
    name: 'Deutsch',
    symbol: 'de-DE'
  },
  {
    name: 'Slovenský',
    symbol: 'sk-SK'
  },
  {
    name: '한국어',
    symbol: 'ko-KR'
  },
  {
    name: 'Portugal',
    symbol: 'pt-PT'
  }
]

export default defineComponent({
  name: 'LanguageSelect',

  computed: {
    language: {
      get () {
        const symbol = this.$store.getters['settings/language']
        const retLng = this.languages.find((l) => l.symbol === symbol) as LanguageInterface
        return retLng
      },
      async set (value: LanguageInterface) {
        await this.$store.dispatch('settings/setLanguage', value.symbol)
      }
    }
  },

  setup () {
    return { languages }
  }
})
</script>

<style lang="sass" scoped>
.menu-item
  background: $light
  color: #7B849C
</style>
