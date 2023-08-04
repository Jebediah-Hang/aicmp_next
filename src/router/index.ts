import { createRouter, createWebHistory } from 'vue-router'

import DesktopLayout from '@/layout/desktop/index.vue'
import MobileLayout from '@/layout/mobile/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: { checkDevice: true },
      redirect: '/aicmp/desktop/home'
    },
    {
      path: '/aicmp/desktop',
      redirect: '/aicmp/desktop/home',
      component: DesktopLayout,
      children: [
        {
          path: 'home',
          name: 'D_Home',
          meta: { checkDevice: true },
          component: () => import('@/views/home/desktop/index.vue')
        },
        {
          path: 'mission',
          name: 'D_Mission',
          meta: { checkDevice: true },
          component: () => import('@/views/mission/desktop/index.vue')
        }
      ]
    },
    {
      path: '/aicmp/mobile',
      redirect: '/aicmp/mobile/home',
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

function checkIsMobile() : boolean {
  const device = navigator.userAgent.toLowerCase()
  return /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(device)
}

router.beforeEach((to, from) => {
  const { fullPath, meta } = to
  if (meta.checkDevice) {
    if (checkIsMobile()) {
      if (fullPath.indexOf('/aicmp') <= -1) {
        return { path: `/aicmp/mobile${fullPath}` }
      } else {
        if (fullPath.indexOf('/mobile') <= -1) {
          return { path: fullPath.replace('/desktop', '/mobile') }
        }
      }
    } else {
      if (fullPath.indexOf('/aicmp') <= -1) {
        return { path: `/aicmp/desktop${fullPath}` }
      } else {
        if (fullPath.indexOf('/desktop') <= -1) {
          return { path: fullPath.replace('/mobile', '/desktop') }
        }
      }
    }
  }
})

export default router
