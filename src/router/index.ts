import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/pages/layout/index.vue'

const MenuPageList = [
  {
    path: 'mission',
    name: '任务管理',
    icon: 'Tickets',
    component: () => import('@/views/mission/index.vue')
  },
  {
    path: 'resource',
    name: '资源管理',
    icon: 'FolderOpened',
    component: () => import('@/views/resource/index.vue')
  },
  {
    path: 'vehicle',
    name: '载具管理',
    icon: 'Van',
    component: () => import('@/views/vehicle/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/management/mission'
    },
    {
      path: '/management',
      component: Layout,
      children: MenuPageList
    },
    {
      path: '/404',
      component: () => import('@/pages/error/404.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})

export const MenuList = MenuPageList.map(item => ({
  path: `/management/${item.path}`,
  name: item.name,
  icon: item.icon
}))

export default router
