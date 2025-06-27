import { createRouter, createWebHashHistory } from 'vue-router'
import GameHomeView from '../views/GameHomeView.vue'
import { useGameStore } from '@/stores/game'

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
      path: '/game-over',
      name: 'game-over',
      component: () => import('../views/GameOverView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const gameStore = useGameStore()

  // If trying to access game-play view
  if (to.name === 'game-play') {
    // If game is not playing and not game over, redirect to home
    if (!gameStore.isPlaying && !gameStore.isGameOver) {
      return next({ name: 'game-home' })
    }
    // If coming from game-over view and game is not playing, cancel navigation
    if (from.name === 'game-over' && !gameStore.isPlaying) {
      return next(false)
    }
  }

  // If trying to access game-win view
  if (to.name === 'game-win') {
    // Only allow if game is completed
    if (!gameStore.isGameCompleted) {
      return next({ name: 'game-home' })
    }
  }

  // If trying to access game-over view
  if (to.name === 'game-over') {
    // Only allow if game is over
    if (!gameStore.isGameOver) {
      return next({ name: 'game-home' })
    }
  }

  // Allow navigation
  next()
})

export default router
