import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', redirect: { name: 'main' } },
      { path: 'main', name: 'main', component: () => import('pages/Main.vue') },
      { path: 'bruteforce', name: 'bruteforce', component: () => import('pages/BruteForce.vue') },
      { path: 'bomber', name: 'bomber', component: () => import('pages/Bomber.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
