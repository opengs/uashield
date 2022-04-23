
<template>
  <q-layout view="hHh lpR fFf" background="dark">

    <q-header reveal elevated class="bg-grey-10 text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="USC512.png">
          </q-avatar> -->
          {{ header }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" class="bg-grey-10 text-white" overlay elevated>
      <q-list bordered separator class="q-mt-sm">
        <MenuLink
          v-for="link of menuList"
          :key="link.link"

          :title="$t(link.title)"
          :caption="$t(link.caption)"
          :link="link.link"
          :icon="link.icon"
        />
      </q-list>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'

import MenuLink from 'components/layout/MenuLink.vue'

const menuList = [
  {
    link: 'dashboard',
    title: 'layout.menu.dashboard.title',
    caption: 'layout.menu.dashboard.caption',
    icon: 'dashboard'
  },
  {
    link: 'ddos',
    title: 'layout.menu.ddos.title',
    caption: 'layout.menu.ddos.caption',
    icon: 'dns'
  },
  {
    link: 'bruteforce',
    title: 'layout.menu.bruteforce.title',
    caption: 'layout.menu.bruteforce.caption',
    icon: 'password'
  },
  /* {
    link: 'bomber',
    title: 'layout.menu.bomber.title',
    caption: 'layout.menu.bomber.caption',
    icon: 'smartphone'
  }, */
  {
    link: 'statistics',
    title: 'layout.menu.statistics.title',
    caption: 'layout.menu.statistics.caption',
    icon: 'leaderboard'
  },
  {
    link: 'settings',
    title: 'layout.menu.settings.title',
    caption: 'layout.menu.settings.caption',
    icon: 'settings'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    MenuLink
  },

  computed: {
    header () {
      return this.$t(`layout.header.${String(this.$route.name)}`)
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return { menuList, leftDrawerOpen }
  }
})
</script>
