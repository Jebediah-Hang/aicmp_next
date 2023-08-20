import { createRouter, createWebHistory } from 'vue-router'
import { desktopRoutePrefix, mobileRoutePrefix } from '@/config'
import DesktopLayout from '@/layout/desktop/index.vue'
import MobileLayout from '@/layout/mobile/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: { checkDevice: true },
      redirect: `${desktopRoutePrefix}/home`
    },
    {
      path: desktopRoutePrefix,
      redirect: `${desktopRoutePrefix}/home`,
      component: DesktopLayout,
      children: [
        {
          path: 'home',
          name: 'D_Home',
          meta: { checkDevice: true },
          component: () => import('@/views/home/desktop/index.vue')
        },
        {
          path: 'past',
          name: 'D_Past',
          meta: { checkDevice: true },
          component: () => import('@/views/mission/desktop/pastMission.vue')
        },
        {
          path: 'upcoming',
          name: 'D_Upcomeing',
          meta: { checkDevice: true },
          component: () => import('@/views/mission/desktop/upcomeMission.vue')
        }
      ]
    },
    {
      path: mobileRoutePrefix,
      redirect: `${mobileRoutePrefix}/home`,
      component: MobileLayout,
      children: [
        {
          path: 'home',
          name: 'M_Home',
          meta: { checkDevice: true },
          component: () => import('@/views/home/mobile/index.vue')
        },
        {
          path: 'mission',
          name: 'M_Mission',
          meta: { checkDevice: true },
          component: () => import('@/views/mission/mobile/index.vue')
        }
      ]
    },
    {
      path: '/404',
      meta: { checkDevice: false },
      component: () => import('@/pages/error.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
      meta: { checkDevice: false }
    }
  ]
})

export default router
