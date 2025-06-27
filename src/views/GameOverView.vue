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
const [faceRef, faceAnimate] = useAnimate<HTMLImageElement>()
const [titleRef, titleAnimate] = useAnimate<HTMLHeadingElement>()
const [buttonRef, animateButton] = useAnimate<HTMLDivElement>()

const onClickBack = () => {
  gameStore.restartGame()
  router.push({ name: 'game-home' })
}

const enterAnimateFace = async () => {
  if (faceAnimate === undefined) return

  await faceAnimate(
    faceRef.value,
    { opacity: [0, 1], scale: [0.8, 1] },
    { duration: 0.5, ease: 'backInOut' },
  )
}

const enterAnimateLogo = async () => {
  if (titleAnimate === undefined) return

  await titleAnimate(
    titleRef.value,
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
  if (faceAnimate === undefined) return

  await faceAnimate(
    faceRef.value,
    { opacity: [1, 0], scale: [1, 0.8] },
    { duration: 0.3, ease: 'backInOut' },
  )
}

const exitAnimateLogo = async () => {
  if (titleAnimate === undefined) return

  await titleAnimate(
    titleRef.value,
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
    <img
      src="@/assets/img/face-gameover.webp"
      alt="Cara llorando"
      class="h-64 object-contain drop-shadow-lg drop-shadow-black/40"
      ref="faceRef"
    />
    <img
      src="@/assets/img/text-gameover.webp"
      alt="Logo de Wanappo TQ"
      class="-mt-4 h-12 object-contain drop-shadow-lg drop-shadow-black/40"
      ref="titleRef"
    />
    <div class="flex w-full max-w-xs flex-col gap-4">
      <button class="btn btn-large btn-secondary" @click="onClickBack" ref="buttonRef">
        Volver al Inicio
      </button>
    </div>
  </div>
</template>
