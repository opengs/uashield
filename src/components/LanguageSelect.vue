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
    icon: 'data:image/png;base64,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bS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTAzLTA1VDAwOjM2OjU0KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAzLTA1VDAwOjM2OjU0KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMy0wNVQwMDozNjo1NCswMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1YWI3NTc4MS1mOGJlLTRiNjUtOTk3Yy05OTM1NGJmYzZkOGIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4OTgzNzEyYS05M2FiLTllNGItYjA2NS1kNGQzOGY4MzIyMDYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiN2YxNzg4MS1jMWFlLTQwYzEtYThiMi0wNmYxNWI5MzAyZmIiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iRGlzcGxheSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjdmMTc4ODEtYzFhZS00MGMxLWE4YjItMDZmMTViOTMwMmZiIiBzdEV2dDp3aGVuPSIyMDIyLTAzLTA1VDAwOjM2OjU0KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWFiNzU3ODEtZjhiZS00YjY1LTk5N2MtOTkzNTRiZmM2ZDhiIiBzdEV2dDp3aGVuPSIyMDIyLTAzLTA1VDAwOjM2OjU0KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7ouA4iAAABBElEQVQ4y+1UsU7DQAx9di7pUmiIihAdYIEBfoHfgB9kRwjBjpj5gYqBpQNCpFlISAo5mxaBSBRVCeiGDrX0ZFmynp6ffUeqChfBcBSrR0QX27tTBzyRUYvIhSITDKQp8zv/ZZ+UXXGjX/05lMBWO7M1FBETbi9DvMUWJ2cpwlDQ5dR47hF+UH4QHiYRHu8CxHKKOD9EnPRQ7VmG2vpt4WE2Ocbzq4GlEV7Ge5B02G008iqVT5jtC7ZGGZL7c9CR4L3vodaz1OzrX7NLYTylA/TLDEW2gd4wh/EEm0HRTnRzsFOxUuGzQIjBi2zpa3ui1D5aPq3rzv97kGw0cfFEaP0ftcYn/mpzaeiYbBgAAAAASUVORK5CYII='
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
