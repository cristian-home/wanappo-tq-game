<script setup lang="ts">
import N4Face from '@/assets/img/N4Face.svg'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useSoundStore } from '@/stores/sound'
import { useAnimate } from 'motion-v'
import { onMounted } from 'vue'

const router = useRouter()
const gameStore = useGameStore()
const soundStore = useSoundStore()

// motion refs
const [faceRef, animateFace] = useAnimate<HTMLDivElement>()
const [logoRef, animateLogo] = useAnimate<HTMLImageElement>()
const [buttonRef, animateButton] = useAnimate<HTMLDivElement>()

const onClickBack = () => {
  gameStore.restartGame()
  router.push({ name: 'game-home' })
}

const enterAnimateFace = async () => {
  if (animateFace === undefined) return

  await animateFace(
    faceRef.value,
    { opacity: [0, 1], scale: [0.8, 1] },
    { duration: 0.5, ease: 'backInOut' },
  )
}

const enterAnimateLogo = async () => {
  if (animateLogo === undefined) return

  await animateLogo(
    logoRef.value,
    { opacity: [0, 1], scale: [0.8, 1] },
    { delay: 0.3, duration: 0.5, ease: 'backInOut' },
  )
}

const enterAnimateButton = async () => {
  if (animateButton === undefined) return

  await animateButton(
    buttonRef.value,
    { opacity: [0, 1], scale: [0.8, 1] },
    { delay: 0.6, duration: 0.5, ease: 'backInOut' },
  )
}

const exitAnimateFace = async () => {
  if (animateFace === undefined) return

  await animateFace(
    faceRef.value,
    { opacity: [1, 0], scale: [1, 0.8] },
    { duration: 0.3, ease: 'backInOut' },
  )
}

const exitAnimateLogo = async () => {
  if (animateLogo === undefined) return

  await animateLogo(
    logoRef.value,
    { opacity: [1, 0], scale: [1, 0.8] },
    { duration: 0.3, ease: 'backInOut', delay: 0.1 },
  )
}

const exitAnimateButton = async () => {
  if (animateButton === undefined) return

  await animateButton(
    buttonRef.value,
    { opacity: [1, 0], scale: [1, 0.8] },
    { duration: 0.3, ease: 'backInOut', delay: 0.2 },
  )
}

const startEnterAnimation = async () => {
  const promises = [enterAnimateFace(), enterAnimateLogo(), enterAnimateButton()]

  await Promise.all(promises)
}

const startExitAnimation = async () => {
  const promises = [exitAnimateFace(), exitAnimateLogo(), exitAnimateButton()]

  await Promise.all(promises)
}

onMounted(() => {
  soundStore.playGameWinSound()
  startEnterAnimation()
})

onBeforeRouteLeave(async (to, from, next) => {
  await startExitAnimation()
  next()
})
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center gap-8 p-8">
    <N4Face class="h-48 max-w-full" ref="faceRef" />
    <img
      src="@/assets/img/LogoGanaste.webp"
      alt="Logo Ganaste"
      class="h-24 max-w-full object-contain"
      ref="logoRef"
    />
    <div class="flex w-full max-w-xs flex-col gap-4">
      <button class="btn btn-large btn-secondary" @click="onClickBack" ref="buttonRef">
        Volver al Inicio
      </button>
    </div>
  </div>
</template>
