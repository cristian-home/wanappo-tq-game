import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import questionsData from '@/data/questions.json'

export interface GameOption {
  id: number
  text?: string
  imageUrl?: string | null
  isCorrect: boolean
  isSelected: boolean
}

export interface GameLevel {
  id: number
  question: string
  incompleteImage: string | null
  completeImage: string | null
  options: GameOption[]
}

export interface GameData {
  levels: Omit<GameLevel, 'options'>[]
}

export const useGameStore = defineStore('game', () => {
  // State
  const currentLevelIndex = ref(0)
  const isGameCompleted = ref(false)
  const isLevelCompleted = ref(false)
  const isGameOver = ref(false)
  const isPlaying = ref(false)
  const currentLevelAttempts = ref(0)
  const levels = ref<GameLevel[]>([])

  // Load game data from JSON
  const loadGameData = async () => {
    try {
      // Transform the JSON data to include isSelected property
      const transformedLevels = questionsData.levels.map((level) => ({
        ...level,
        options: level.options.map((option) => ({
          ...option,
          isSelected: false,
        })),
      }))

      // Shuffle the levels randomly
      levels.value = [...transformedLevels].sort(() => Math.random() - 0.5)
    } catch (error) {
      console.error('Error loading game data:', error)
    }
  }

  // Getters
  const currentLevel = computed(() => {
    if (levels.value.length === 0 || currentLevelIndex.value >= levels.value.length) {
      return null
    }
    return levels.value[currentLevelIndex.value]
  })

  const totalLevels = computed(() => levels.value.length)

  const currentLevelNumber = computed(() => currentLevelIndex.value + 1)

  const randomOrderedOptions = computed(() => {
    if (!currentLevel.value) return []
    return [...currentLevel.value.options].sort(() => Math.random() - 0.5)
  })

  const selectedOptions = computed(() => {
    if (!currentLevel.value) return []
    return currentLevel.value.options.filter((option) => option.isSelected)
  })

  const correctSelectedOptions = computed(() => {
    if (!currentLevel.value) return []
    return currentLevel.value.options.filter((option) => option.isSelected && option.isCorrect)
  })

  const wrongSelectedOptions = computed(() => {
    if (!currentLevel.value) return []
    return currentLevel.value.options.filter((option) => option.isSelected && !option.isCorrect)
  })

  const correctOptionsLeft = computed(() => {
    if (!currentLevel.value) return []
    return currentLevel.value.options.filter((option) => option.isCorrect && !option.isSelected)
  })

  const allCorrectOptionsSelected = computed(() => {
    return correctOptionsLeft.value.length === 0
  })

  const canProceedToNextLevel = computed(() => {
    return allCorrectOptionsSelected.value && isLevelCompleted.value
  })

  const maxAttemptsForCurrentLevel = computed(() => {
    if (!currentLevel.value) return 0
    const correctOptionsCount = currentLevel.value.options.filter(
      (option) => option.isCorrect,
    ).length
    return correctOptionsCount + 1 // Allow one extra attempt
  })

  const hasExceededAttempts = computed(() => {
    return currentLevelAttempts.value >= maxAttemptsForCurrentLevel.value
  })

  // Actions
  const selectOption = (optionId: number) => {
    if (!currentLevel.value || isLevelCompleted.value || hasExceededAttempts.value) return

    const option = currentLevel.value.options.find((opt) => opt.id === optionId)
    if (!option) return

    // If it's a correct option and already selected, do nothing
    if (option.isCorrect && option.isSelected) {
      return
    }

    // If option is already selected, deselect it
    if (option.isSelected) {
      option.isSelected = false
      return
    }

    // Deselect all wrong options before selecting a new one
    wrongSelectedOptions.value.forEach((wrongOption) => {
      wrongOption.isSelected = false
    })

    // Select the current option
    option.isSelected = true

    // Increment attempts for any option selection (correct or incorrect)
    currentLevelAttempts.value++

    // Check if level is completed first
    checkLevelCompletion()

    // If level is completed after this selection, don't end the game even if attempts exceeded
    if (isLevelCompleted.value) {
      return
    }

    // Check if attempts exceeded only if level is not completed
    if (hasExceededAttempts.value) {
      isGameOver.value = true
      isPlaying.value = false
      return
    }
  }

  const checkLevelCompletion = () => {
    if (allCorrectOptionsSelected.value) {
      isLevelCompleted.value = true
    }
  }

  const nextLevel = () => {
    if (!canProceedToNextLevel.value) return

    if (currentLevelIndex.value < levels.value.length - 1) {
      currentLevelIndex.value++
      isLevelCompleted.value = false
      currentLevelAttempts.value = 0 // Reset attempts for new level
    } else {
      completeGame()
    }
  }

  const completeGame = () => {
    isGameCompleted.value = true
    isPlaying.value = false
  }

  const restartGame = () => {
    currentLevelIndex.value = 0
    isGameCompleted.value = false
    isLevelCompleted.value = false
    isGameOver.value = false
    isPlaying.value = true
    currentLevelAttempts.value = 0

    // Reset all option selections
    levels.value.forEach((level) => {
      level.options.forEach((option) => {
        option.isSelected = false
      })
    })

    // Shuffle the levels randomly for a new game experience
    levels.value = [...levels.value].sort(() => Math.random() - 0.5)
  }

  const resetCurrentLevel = () => {
    if (!currentLevel.value) return

    currentLevel.value.options.forEach((option) => {
      option.isSelected = false
    })
    isLevelCompleted.value = false
    currentLevelAttempts.value = 0
  }

  const startGame = () => {
    isPlaying.value = true
    isGameOver.value = false
    isGameCompleted.value = false
  }

  const goToLevel = (levelIndex: number) => {
    if (levelIndex >= 0 && levelIndex < levels.value.length) {
      currentLevelIndex.value = levelIndex
      isLevelCompleted.value = false
      currentLevelAttempts.value = 0
    }
  }

  const getOptionById = (optionId: number) => {
    if (!currentLevel.value) return null
    return currentLevel.value.options.find((option) => option.id === optionId) || null
  }

  const isOptionSelected = (optionId: number) => {
    const option = getOptionById(optionId)
    return option?.isSelected || false
  }

  const isOptionCorrect = (optionId: number) => {
    const option = getOptionById(optionId)
    return option?.isCorrect || false
  }

  const getOptionStatus = (optionId: number) => {
    const option = getOptionById(optionId)
    if (!option) return 'normal'

    if (option.isSelected && option.isCorrect) return 'correct'
    if (option.isSelected && !option.isCorrect) return 'wrong'
    return 'normal'
  }

  // Initialize game data on store creation
  loadGameData()

  return {
    // State
    currentLevelIndex,
    isGameCompleted,
    isLevelCompleted,
    isGameOver,
    isPlaying,
    currentLevelAttempts,
    levels,

    // Getters
    currentLevel,
    totalLevels,
    currentLevelNumber,
    randomOrderedOptions,
    selectedOptions,
    correctSelectedOptions,
    wrongSelectedOptions,
    correctOptionsLeft,
    allCorrectOptionsSelected,
    canProceedToNextLevel,
    maxAttemptsForCurrentLevel,
    hasExceededAttempts,

    // Actions
    loadGameData,
    selectOption,
    checkLevelCompletion,
    nextLevel,
    completeGame,
    restartGame,
    resetCurrentLevel,
    startGame,
    goToLevel,
    getOptionById,
    isOptionSelected,
    isOptionCorrect,
    getOptionStatus,
  }
})
