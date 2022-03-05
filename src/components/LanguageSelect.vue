<template>
  <q-select
    v-model="language"
    color="white"
    outlined
    dark
    :options="languages"
    :option-value="opt => opt.symbol"
    :option-label="opt => opt.name"
    options-selected-class="text-yellow"
    :label="$t('language')"
    label-color="white"
    bg-color="grey-10"
    behavior="menu"
  >
    <template class="q-pa-none" v-slot:prepend>
      <div class="q-pb-sm row items-start">
        <q-img :src="language.icon" height="20px" width="18px" />
      </div>
    </template>
    <template v-slot:option="scope">
      <q-item class="bg-grey-8" v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label v-html="scope.opt.symbol" />
          <q-item-label caption v-text="scope.opt.name" />
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts">

import { defineComponent, ref, onMounted } from 'vue'

interface LanguageInterface {
  name: string,
  symbol: string,
  icon: string
}

const languages : LanguageInterface[] = [
  {
    name: 'Українська',
    symbol: 'ua-UA',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAaUlEQVQ4jWNgGGjAGNd97J6gAD8zOZrff/j4l0VQgJ9ZRkZajkwHPGIiUyMcDLwBLH++vBZ8//LXF3I0//nyUZDx1+3+h6zCImQF4u+3b4ZDIFIeC/8+f/77m4HhETma/33+/JdSB1AOALKnIrjz6I7LAAAAAElFTkSuQmCC'
  },
  {
    name: 'English',
    symbol: 'en-US',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAABKklEQVQ4jcWQv0rDcBSFz/0laZqkAbVY8U9FrRRcRBAHhw6uPoIP0+fxCdwyFSfpaBAUG0GFxNKSNk2bxOQ6iJv1B+3gt5zpHL57gf+G2u3rnq6XmZmhKER5zvyTaZbSlXdzO6+cxjGpzfPTurm+qfT6n7g4MuC4U5zt63j0M7w9ezhoVffmDQxd1xcP3pA/xgVOdktw3ClazTK6XoIVU6CxVZGeIHZqFbINgfv3DMf1Eu56CQ43NAyiAi/+RDqghpOEtbTAmiXghzlqtoJBVEDXCLapyQ3GSUGzjKEpBH+UwygR+lEOZkBTxd9tIqiN8GlmvI4sBlAHEAffiQCoEAOSN6iXehCtblctqetvMEPiKEeAefE20fIGqt/pOMNudyGNNI5pWYHl+QJYo3QxhpvieAAAAABJRU5ErkJggg=='
  },
  {
    name: 'Español',
    symbol: 'es-ES',
    icon: ''
  },
  {
    name: 'Polski',
    symbol: 'pl-PL',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAc0lEQVQ4jWNgGGjAuOPkzXtiwvzM5Gh+9fbjXxYxYX5mFTlxOTId8IiJTI1wMAwMYLycnvlbUEyUhRzN71+9/sPCJyTIICwkSJbtf//8GQRhQLkBf/7+I1vzn7//GFg+377ZfOveHXZyDPj/9+9Psm2HAQBUliKKS0ahOgAAAABJRU5ErkJggg=='
  },
  {
    name: 'Čeština',
    symbol: 'cs-CZ',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAACmAAAApgHdff84AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAI1QTFRF////c0iHc3iy9vb2/0lW8/P0/kpV9vb2/0tVpqnOrEpznqDJo0p2lpjGm0l63N7p5UpfQEeb4uLr60pd5ebs7kpa6env80pZ9fX1/0pVX2WqYUeP9fX1/0tVW1+pXEiSVlumV0eTU1ijVEiU9PT0/ktW9PT0/ktW9vb2/0tWQkebQkibQUeb9fX1/0tVK414PgAAACx0Uk5TADU1Ozu5uby8wcHCwsTEx8fKysrOztHR0dHf3+Dg4+Pn5+rq7u7x8fT0/v4Gju4WAAAAbElEQVQoz63QOwqAMBAE0FklSOxSBQnoBXL/42i0FZv4a0S9wGyXLffBfkaglBSEqvakvT7i7ENFIr5xMGRUBJCvjgMwhYYDjhw4ALO3HHBtPYdbgYWPOpXliZ+78wffRCNxrRKiGCV2KFUQfgPsHnPTeHKpAAAAAElFTkSuQmCC'
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
    const getDefaultLanguage = () => {
      const userLanguage = navigator.language
      const defaultLanguage = languages.find(({ symbol }) => symbol.includes(userLanguage))
      return defaultLanguage || languages[0]
    }

    const language = ref<LanguageInterface>(languages[0])
    onMounted(() => (language.value = getDefaultLanguage()))

    return { languages, language }
  }
})
</script>
