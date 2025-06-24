<script setup lang="ts">
import N4Face from '@/assets/img/N4Face.svg'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const onClickRestart = () => {
  gameStore.restartGame()
  router.push({ name: 'game-play' })
}

const onClickBack = () => {
  gameStore.restartGame()
  router.push({ name: 'game-home' })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen p-8 gap-8">
    <N4Face class="h-48 max-w-full" />
    <img
      src="@/assets/img/LogoGanaste.webp"
      alt="Logo Ganaste"
      class="h-24 max-w-full object-contain"
    />
    <div class="flex flex-col gap-4 w-full max-w-xs">
      <button class="btn btn-large" @click="onClickRestart">Jugar de Nuevo</button>
      <button class="btn btn-large btn-secondary" @click="onClickBack">Volver al Inicio</button>
    </div>
  </div>
</template>
