import { createRouter, createWebHistory } from 'vue-router'
import { RouterConfig } from '@/config'
import DesktopLayout from '@/layout/desktop/index.vue'
import MobileLayout from '@/layout/mobile/index.vue'

const {
  RoutePathPrefixDesktop,
  RoutePathPrefixMobile,
  RouteNamePrefixDesktop,
  RouteNamePrefixMobile
} = RouterConfig

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: `${RoutePathPrefixDesktop}/home`
    },
    {
      path: RoutePathPrefixDesktop,
      redirect: `${RoutePathPrefixDesktop}/home`,
      component: DesktopLayout,
      children: [
        {
          path: 'home',
          name: `${RouteNamePrefixDesktop}Home`,
          component: () => import('@/views/home/desktop/index.vue')
        },
        {
          path: 'mission',
          name: `${RouteNamePrefixDesktop}Mission`,
          component: () => import('@/views/mission/desktop/index.vue')
        }
      ]
    },
    {
      path: RoutePathPrefixMobile,
      redirect: `${RoutePathPrefixMobile}/home`,
      component: MobileLayout,
      children: [
        {
          path: 'home',
          name: `${RouteNamePrefixMobile}Home`,
          component: () => import('@/views/home/mobile/index.vue')
        },
        {
          path: 'mission',
          name: `${RouteNamePrefixMobile}Mission`,
          component: () => import('@/views/mission/mobile/index.vue')
        }
      ]
    },
    {
      path: '/404',
      component: () => import('@/pages/error.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})

export default router
