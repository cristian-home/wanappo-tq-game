<script setup lang="ts">
import GameHeaderLabel from '@/components/game/GameHeaderLabel.vue'
import { useGameStore } from '@/stores/game'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useResolveAssetUrl } from '@/composables/useResolveAssetURL'

const gameStore = useGameStore()
const router = useRouter()

const handleNextLevel = () => {
  if (gameStore.canProceedToNextLevel) {
    if (gameStore.currentLevelIndex < gameStore.totalLevels - 1) {
      gameStore.nextLevel()
    } else {
      gameStore.completeGame()
      router.push({ name: 'game-win' })
    }
  }
}

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

        alert(message)

        handleNextLevel()
      }, 500)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative w-dvw h-dvh flex flex-col items-center justify-center p-8">
    <div
      v-if="gameStore.currentLevel"
      class="w-xl max-w-full flex flex-col items-center justify-center gap-16"
    >
      <div class="text-center text-xs opacity-75 -mb-12">
        Nivel {{ gameStore.currentLevelNumber }} de {{ gameStore.totalLevels }}
      </div>

      <GameHeaderLabel class="w-96 max-w-full">
        {{ gameStore.currentLevel.question }}
      </GameHeaderLabel>

      <img
        :src="useResolveAssetUrl(gameStore.currentLevel.coverImage).value"
        alt="Game Background"
        class="max-w-full w-96 object-cover drop-shadow-xl"
      />

      <div class="grid grid-cols-2 gap-x-10 gap-y-8 w-full">
        <button
          class="btn"
          v-for="option in gameStore.randomOrderedOptions"
          :key="option.id"
          :class="{
            'btn-success': option.isCorrect && option.isSelected,
            'btn-danger': !option.isCorrect && option.isSelected,
          }"
          :disabled="gameStore.isLevelCompleted"
          @click="gameStore.selectOption(option.id)"
        >
          <img
            v-if="option.imageUrl"
            :src="useResolveAssetUrl(option.imageUrl).value"
            alt="Option Image"
            class="w-full object-contain"
          />
          <span v-else>{{ option.text }}</span>
        </button>
      </div>
    </div>

    <div v-else class="text-center">
      <p>Cargando nivel...</p>
    </div>
  </div>
</template>
