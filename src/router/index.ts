import { createRouter, createWebHashHistory } from 'vue-router'
import GameHomeView from '../views/GameHomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game-home',
      component: GameHomeView,
    },
    {
      path: '/game-play',
      name: 'game-play',
      component: () => import('../views/GamePlayView.vue'),
    },
    {
      path: '/game-win',
      name: 'game-win',
      component: () => import('../views/GameWinView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
