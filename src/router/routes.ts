import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', redirect: { name: 'dashboard' } },
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { path: 'ddos', name: 'ddos', component: () => import('pages/DDoS.vue') },
      { path: 'bruteforce', name: 'bruteforce', component: () => import('pages/BruteForce.vue') },
      { path: 'statistics', name: 'statistics', component: () => import('pages/Statistics.vue') },
      { path: 'settings', name: 'settings', component: () => import('pages/Settings.vue') }
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
