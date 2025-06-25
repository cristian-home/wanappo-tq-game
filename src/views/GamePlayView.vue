<script setup lang="ts">
import GameHeaderLabel from '@/components/game/GameHeaderLabel.vue'
import { useGameStore } from '@/stores/game'
import { useSoundStore } from '@/stores/sound'
import { watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useResolveAssetUrl } from '@/composables/useResolveAssetURL'
import { AnimatePresence, motion, useAnimate } from 'motion-v'

const gameStore = useGameStore()
const soundStore = useSoundStore()
const router = useRouter()

// Motion refs
const [headerScope, headerAnimate] = useAnimate<HTMLDivElement>()
const [coverImageScope, coverImageAnimate] = useAnimate<HTMLImageElement>()
const [optionsScope, optionsAnimate] = useAnimate<HTMLDivElement>()

// const MotionGameHeaderLabel = motion.create(GameHeaderLabel)

const heaederExitAnimation = async () => {
  const promise = new Promise((resolve) => {
    if (headerAnimate === undefined) {
      resolve(true)
      return
    }

    headerAnimate(headerScope.value, { opacity: [1, 0], scale: [1, 0] }, { duration: 0.3 }).then(
      () => {
        resolve(true)
      },
    )
  })

  return await promise
}

const coverImageExitAnimation = async () => {
  const promise = new Promise((resolve) => {
    if (coverImageAnimate === undefined) {
      resolve(true)
      return
    }

    coverImageAnimate(
      coverImageScope.value,
      { opacity: [1, 0], scale: [1, 0.8] },
      { duration: 0.3 },
    ).then(() => {
      resolve(true)
    })
  })

  return await promise
}

const optionsExitAnimation = async () => {
  const promise = new Promise((resolve) => {
    if (optionsAnimate === undefined) {
      resolve(true)
      return
    }

    optionsAnimate(
      'button',
      { opacity: [1, 0], scale: [1, 0] },
      {
        duration: 0.3,
        delay: (i) => i * 0.1,
        ease: 'backInOut',
      },
    ).then(() => {
      resolve(true)
    })
  })

  return await promise
}

const startExitAnimation = async () => {
  // animations promises
  const headerPromise = heaederExitAnimation()
  const coverImagePromise = coverImageExitAnimation()
  const optionsPromise = optionsExitAnimation()

  return await Promise.all([headerPromise, coverImagePromise, optionsPromise])
}

const handleNextLevel = () => {
  if (gameStore.canProceedToNextLevel) {
    if (gameStore.currentLevelIndex < gameStore.totalLevels - 1) {
      soundStore.playLevelUpSound()
      gameStore.nextLevel()
    } else {
      soundStore.playGameWinSound()
      gameStore.completeGame()
      router.push({ name: 'game-win' })
    }
  }
}

const handleOptionClick = (optionId: number) => {
  if (!gameStore.currentLevel || gameStore.isLevelCompleted) return

  const option = gameStore.currentLevel.options.find((opt) => opt.id === optionId)
  if (!option) return

  // Play appropriate sound based on option correctness
  if (option.isCorrect) {
    soundStore.playRightAnswerSound()
  } else {
    soundStore.playWrongAnswerSound()
  }

  // Select the option in the game store
  gameStore.selectOption(optionId)
}

onBeforeRouteLeave(async (to, from, next) => {
  if (gameStore.isLevelCompleted) {
    await startExitAnimation()
    next()
  } else {
    const confirmed = confirm(
      '¿Estás seguro de que quieres abandonar el nivel? Los cambios no se guardarán.',
    )
    if (confirmed) {
      await startExitAnimation()
      next()
    } else {
      next(false)
    }
  }
})

// Watch for level completion
watch(
  () => gameStore.allCorrectOptionsSelected,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        const message =
          gameStore.currentLevelIndex < gameStore.totalLevels - 1
            ? '¡Felicidades! Has completado el nivel correctamente.'
            : '¡Felicidades! Has completado todos los niveles del juego.'

        console.log(message)

        handleNextLevel()
      }, 500)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative flex h-dvh w-dvw flex-col items-center justify-center px-4 py-8">
    <div
      v-if="gameStore.currentLevel"
      class="flex w-xl max-w-full flex-col items-center justify-center gap-10"
    >
      <motion.div
        class="-mb-4 text-center text-xs opacity-75"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: 0.2 }"
      >
        <span>Nivel {{ gameStore.currentLevelNumber }} de {{ gameStore.totalLevels }}</span>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, scale: 0 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.5, ease: 'easeInOut' }"
        class="flex h-20 w-96 max-w-full items-center justify-center"
        ref="headerScope"
      >
        <GameHeaderLabel class="max-w-full before:backdrop-blur-[2px]">
          <AnimatePresence :mode="'wait'">
            <motion.span
              class="w-full"
              :key="gameStore.currentLevel.id"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :exit="{ opacity: 0 }"
            >
              {{ gameStore.currentLevel.question }}
            </motion.span>
          </AnimatePresence>
        </GameHeaderLabel>
      </motion.div>

      <div class="h-32 w-96 max-w-full">
        <AnimatePresence :mode="'wait'">
          <motion.img
            v-if="gameStore.currentLevel.coverImage"
            :key="gameStore.currentLevel.id"
            :src="useResolveAssetUrl(gameStore.currentLevel.coverImage).value"
            :initial="{ opacity: 0, scale: 0.8 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.8 }"
            :transition="{ delay: 0, duration: 0.5, ease: 'easeInOut' }"
            alt="Game Background"
            class="h-full w-full object-contain drop-shadow-xl"
            ref="coverImageScope"
          />
        </AnimatePresence>
      </div>

      <div
        class="grid w-full grid-cols-2 grid-rows-[4rem_4rem_4rem] gap-x-8 gap-y-8"
        ref="optionsScope"
      >
        <AnimatePresence
          :mode="'wait'"
          v-for="(option, index) in gameStore.randomOrderedOptions"
          :key="index"
        >
          <motion.button
            :key="option.id"
            class="btn flex items-center justify-center px-4 py-0 text-lg font-bold"
            :initial="{ opacity: 0, scale: 0 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0 }"
            :transition="{ duration: 0.3, delay: 0 + index * 0.1, ease: 'backInOut' }"
            :class="{
              'btn-success': option.isCorrect && option.isSelected,
              'btn-danger': !option.isCorrect && option.isSelected,
            }"
            :disabled="gameStore.isLevelCompleted"
            @click="handleOptionClick(option.id)"
          >
            <img
              v-if="option.imageUrl"
              :src="useResolveAssetUrl(option.imageUrl).value"
              class="h-16 max-w-full object-contain drop-shadow-sm drop-shadow-black/50"
              alt="Option Image"
            />
            <span v-else>{{ option.text }}</span>
          </motion.button>
        </AnimatePresence>
      </div>
    </div>

    <div v-else class="text-center">
      <p>Cargando nivel...</p>
    </div>
  </div>
</template>
