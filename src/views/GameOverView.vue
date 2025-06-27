<script setup lang="ts">
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useSoundStore } from '@/stores/sound'
import { useAnimate } from 'motion-v'
import { onMounted } from 'vue'

const router = useRouter()
const gameStore = useGameStore()
const soundStore = useSoundStore()

// motion refs
const [title1Ref, animateTitle1] = useAnimate<HTMLH1Element>()
const [title2Ref, animateTitle2] = useAnimate<HTMLH2Element>()
const [buttonRef, animateButton] = useAnimate<HTMLDivElement>()

const onClickBack = () => {
  gameStore.restartGame()
  router.push({ name: 'game-home' })
}

const enterAnimateFace = async () => {
  if (animateTitle1 === undefined) return

  await animateTitle1(
    title1Ref.value,
    { opacity: [0, 1], scale: [0.8, 1] },
    { duration: 0.5, ease: 'backInOut' },
  )
}

const enterAnimateLogo = async () => {
  if (animateTitle2 === undefined) return

  await animateTitle2(
    title2Ref.value,
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
  if (animateTitle1 === undefined) return

  await animateTitle1(
    title1Ref.value,
    { opacity: [1, 0], scale: [1, 0.8] },
    { duration: 0.3, ease: 'backInOut' },
  )
}

const exitAnimateLogo = async () => {
  if (animateTitle2 === undefined) return

  await animateTitle2(
    title2Ref.value,
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
  <div class="flex h-screen flex-col items-center justify-center gap-12 p-8">
    <h1 class="text-center text-4xl drop-shadow-lg drop-shadow-black/40" ref="title1Ref">
      TERMINÓ EL JUEGO
    </h1>
    <h2 class="text-center text-3xl" ref="title2Ref">Mejor suerte para la próxima!</h2>
    <div class="flex w-full max-w-xs flex-col gap-4">
      <button class="btn btn-large btn-secondary" @click="onClickBack" ref="buttonRef">
        Volver al Inicio
      </button>
    </div>
  </div>
</template>
