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
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAaUlEQVQ4jWNgGGjAGNd97J6gAD8zOZrff/j4l0VQgJ9ZRkZajkwHPGIiUyMcDLwBLH++vBZ8//LXF3I0//nyUZDx1+3+h6zCImQF4u+3b4ZDIFIeC/8+f/77m4HhETma/33+/JdSB1AOALKnIrjz6I7LAAAAAElFTkSuQmCC'
  },
  {
    name: 'English',
    symbol: 'en-US',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAABKklEQVQ4jcWQv0rDcBSFz/0laZqkAbVY8U9FrRRcRBAHhw6uPoIP0+fxCdwyFSfpaBAUG0GFxNKSNk2bxOQ6iJv1B+3gt5zpHL57gf+G2u3rnq6XmZmhKER5zvyTaZbSlXdzO6+cxjGpzfPTurm+qfT6n7g4MuC4U5zt63j0M7w9ezhoVffmDQxd1xcP3pA/xgVOdktw3ClazTK6XoIVU6CxVZGeIHZqFbINgfv3DMf1Eu56CQ43NAyiAi/+RDqghpOEtbTAmiXghzlqtoJBVEDXCLapyQ3GSUGzjKEpBH+UwygR+lEOZkBTxd9tIqiN8GlmvI4sBlAHEAffiQCoEAOSN6iXehCtblctqetvMEPiKEeAefE20fIGqt/pOMNudyGNNI5pWYHl+QJYo3QxhpvieAAAAABJRU5ErkJggg=='
  },
  {
    name: 'Polski',
    symbol: 'pl-PL',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAc0lEQVQ4jWNgGGjAuOPkzXtiwvzM5Gh+9fbjXxYxYX5mFTlxOTId8IiJTI1wMAwMYLycnvlbUEyUhRzN71+9/sPCJyTIICwkSJbtf//8GQRhQLkBf/7+I1vzn7//GFg+377ZfOveHXZyDPj/9+9Psm2HAQBUliKKS0ahOgAAAABJRU5ErkJggg=='
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
