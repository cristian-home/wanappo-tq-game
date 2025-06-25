<script setup lang="ts">
import N4Logo from '@/assets/img/N4Logo.svg'
import { motion, useAnimate } from 'motion-v'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useRenderStore } from '@/stores/render'
import { useSoundStore } from '@/stores/sound'
import { onMounted } from 'vue'

const router = useRouter()
const renderStore = useRenderStore()
const gameStore = useGameStore()
const soundStore = useSoundStore()

// Motion components
const N4LogoMotion = motion.create(N4Logo)

// Motion refs
const [buttonRef, animateButton] = useAnimate<HTMLElement>()

const startEnterAnimation = () => {
  if (animateButton !== undefined)
    animateButton(
      buttonRef.value,
      { y: [100, 0], opacity: [0, 1] },
      {
        delay: 0.6,
      },
    )
}

const startExitAnimation = async () => {
  const promise = new Promise((resolve) => {
    if (animateButton === undefined) {
      resolve(true)
      return
    }

    animateButton(
      buttonRef.value,
      {
        opacity: [1, 0],
      },
      { duration: 0.2 },
    ).then(() => {
      resolve(true)
    })
  })

  return await promise
}

const onClickStart = () => {
  soundStore.playStartGameSound()
  soundStore.startBackgroundMusic()
  gameStore.restartGame()
  router.push({ name: 'game-play' })
}

onMounted(() => {
  startEnterAnimation()
})

onBeforeRouteLeave((to, from, next) => {
  startExitAnimation().then(() => {
    next()
  })
})
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center gap-16 p-8">
    <motion.div
      layoutId="logo"
      class="logo"
      :transition="
        renderStore.isInitialRender ? { duration: 0 } : { duration: 0.5, ease: 'backInOut' }
      "
    >
      <N4LogoMotion
        :initial="renderStore.isInitialRender ? { opacity: 0, y: 100 } : { opacity: 1, y: 0 }"
        :animate="renderStore.isInitialRender ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }"
        :transition="renderStore.isInitialRender ? { delay: 0.3 } : { delay: 0.3 }"
        class="h-48 max-w-full"
      />
    </motion.div>
    <button class="btn btn-large opacity-0" @click="onClickStart" ref="buttonRef">INICIO</button>
  </div>
</template>
