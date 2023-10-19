import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/pages/layout/index.vue'

const MenuPageList = [
  {
    path: 'mission',
    name: '任务',
    icon: 'Tickets',
    component: () => import('@/views/mission/index.vue')
  },
  {
    path: 'news',
    name: '新闻',
    icon: 'Notification',
    component: () => import('@/views/news/index.vue')
  },
  {
    path: 'trend',
    name: '动态',
    icon: 'Connection',
    component: () => import('@/views/trend/index.vue')
  },
  {
    path: 'article',
    name: '文章',
    icon: 'Reading',
    component: () => import('@/views/article/index.vue')
  },
  {
    path: 'resource',
    name: '资源',
    icon: 'FolderOpened',
    component: () => import('@/views/resource/index.vue')
  },
  {
    path: 'vehicle',
    name: '载具',
    icon: 'Van',
    component: () => import('@/views/vehicle/index.vue')
  },
  {
    path: 'dictionary',
    name: '字典',
    icon: 'Suitcase',
    component: () => import('@/views/dictionary/index.vue')
  },
  {
    path: 'suggestion',
    name: '留言',
    icon: 'ChatDotSquare',
    component: () => import('@/views/suggestion/index.vue')
  },
  {
    path: 'user',
    name: '用户',
    icon: 'User',
    component: () => import('@/views/user/index.vue')
  },
  {
    path: 'manager',
    name: '管理员',
    icon: 'CreditCard',
    component: () => import('@/views/manager/index.vue')
  },
  {
    path: 'personal',
    name: '个人中心',
    icon: 'House',
    component: () => import('@/views/personal/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@/pages/login/index.vue')
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
