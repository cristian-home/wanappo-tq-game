<script setup lang="ts">
import GameHeaderLabel from '@/components/game/GameHeaderLabel.vue'
import { useGameStore } from '@/stores/game'
import { useSoundStore } from '@/stores/sound'
import { watch, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useResolveAssetUrl } from '@/composables/useResolveAssetURL'
import { AnimatePresence, motion, useAnimate } from 'motion-v'

const gameStore = useGameStore()
const soundStore = useSoundStore()
const router = useRouter()

// State for complete product display
const showCompleteProduct = ref(false)

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
      showCompleteProduct.value = false
    } else {
      soundStore.playGameWinSound()
      gameStore.completeGame()
      router.push({ name: 'game-win' })
    }
  }
}

const showCompleteProductAndProceed = () => {
  // Show the complete product with sunburst effect
  showCompleteProduct.value = true

  // Hide the complete product after 3 seconds and proceed to next level after additional 500ms
  setTimeout(() => {
    showCompleteProduct.value = false
    setTimeout(() => {
      handleNextLevel()
    }, 500)
  }, 2500)
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
  if (gameStore.isLevelCompleted || gameStore.isGameOver) {
    await startExitAnimation()
    next()
  } else {
    next(false)
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

        showCompleteProductAndProceed()
      }, 500)
    }
  },
  { immediate: true },
)

// Watch for game over
watch(
  () => gameStore.isGameOver,
  (newValue) => {
    if (newValue) {
      setTimeout(async () => {
        router.push({ name: 'game-over' })
      }, 1000)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative flex h-dvh w-dvw flex-col items-center justify-center px-4 py-8">
    <div
      v-if="gameStore.currentLevel"
      class="flex w-xl max-w-full flex-col items-center justify-center gap-6"
    >
      <motion.div
        class="-mb-4 h-12 text-center text-xs opacity-75"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3, delay: 0.2 }"
      >
        <span>Nivel {{ gameStore.currentLevelNumber }} de {{ gameStore.totalLevels }}</span>
        <br />
        <span class="text-orange-400">
          Movimientos restantes:
          {{ gameStore.maxAttemptsForCurrentLevel - gameStore.currentLevelAttempts }}
        </span>
        <span
          v-if="gameStore.currentLevelAttempts === gameStore.maxAttemptsForCurrentLevel - 1"
          class="block animate-pulse font-bold text-red-500"
        >
          ¡Último intento!
        </span>
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

      <div class="h-64 w-auto max-w-full">
        <AnimatePresence :mode="'wait'">
          <motion.img
            v-if="gameStore.currentLevel.incompleteImage"
            :key="gameStore.currentLevel.id"
            :src="useResolveAssetUrl(gameStore.currentLevel.incompleteImage).value"
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

    <!-- Complete Product Display with Sunburst Effect -->
    <AnimatePresence>
      <motion.div
        v-if="showCompleteProduct && gameStore.currentLevel?.completeImage"
        :key="'complete-' + gameStore.currentLevel.id"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.5 }"
      >
        <!-- Sunburst Background -->
        <!-- <div class="sunburst-bg absolute inset-0 h-32 w-32"></div> -->

        <!-- Complete Product Image Container -->
        <motion.div
          class="relative z-10 flex items-center justify-center"
          :initial="{ scale: 0, rotate: -180 }"
          :animate="{ scale: 1, rotate: 0 }"
          :exit="{ scale: 0, rotate: 180 }"
          :transition="{ duration: 0.8, ease: 'backOut' }"
        >
          <!-- Glow effect background -->
          <div
            class="bg-gradient-radial absolute inset-0 scale-150 rounded-full from-yellow-400/30 via-orange-400/20 to-transparent blur-xl"
          ></div>

          <!-- Product image -->
          <img
            :src="useResolveAssetUrl(gameStore.currentLevel.completeImage).value"
            alt="Complete Product"
            class="relative z-10 h-80 w-80 max-w-full object-contain brightness-110 drop-shadow-2xl saturate-110 filter"
          />

          <!-- Sparkle effects -->
          <div class="absolute inset-0 animate-ping">
            <div
              class="absolute top-4 left-4 h-2 w-2 animate-pulse rounded-full bg-yellow-300"
            ></div>
            <div
              class="absolute top-8 right-8 h-1 w-1 animate-pulse rounded-full bg-white delay-300"
            ></div>
            <div
              class="absolute bottom-6 left-12 h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-200 delay-700"
            ></div>
            <div
              class="absolute right-6 bottom-12 h-1 w-1 animate-pulse rounded-full bg-orange-300 delay-500"
            ></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style scoped>
/* Radial gradient utility */
.bg-gradient-radial {
  background: radial-gradient(var(--tw-gradient-stops));
}
</style>
