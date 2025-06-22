import { createRouter, createWebHashHistory } from 'vue-router'
import GameHomeView from '../views/GameHomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GameHomeView,
    },
    {
      path: '/game-play',
      name: 'game-play',
      // route level code-splitting
      // this generates a separate chunk (GamePlay.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GamePlayView.vue'),
    },
    {
      path: '/game-over',
      name: 'game-over',
      // route level code-splitting
      // this generates a separate chunk (GameOver.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GameOverView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
