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
  coverImage: string | null
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
  const levels = ref<GameLevel[]>([])

  // Load game data from JSON
  const loadGameData = async () => {
    try {
      // Transform the JSON data to include isSelected property
      levels.value = questionsData.levels.map((level) => ({
        ...level,
        options: level.options.map((option) => ({
          ...option,
          isSelected: false,
        })),
      }))
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

  // Actions
  const selectOption = (optionId: number) => {
    if (!currentLevel.value || isLevelCompleted.value) return

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

    // Check if level is completed
    checkLevelCompletion()
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
    } else {
      completeGame()
    }
  }

  const completeGame = () => {
    isGameCompleted.value = true
  }

  const restartGame = () => {
    currentLevelIndex.value = 0
    isGameCompleted.value = false
    isLevelCompleted.value = false

    // Reset all option selections
    levels.value.forEach((level) => {
      level.options.forEach((option) => {
        option.isSelected = false
      })
    })
  }

  const resetCurrentLevel = () => {
    if (!currentLevel.value) return

    currentLevel.value.options.forEach((option) => {
      option.isSelected = false
    })
    isLevelCompleted.value = false
  }

  const goToLevel = (levelIndex: number) => {
    if (levelIndex >= 0 && levelIndex < levels.value.length) {
      currentLevelIndex.value = levelIndex
      isLevelCompleted.value = false
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

    // Actions
    loadGameData,
    selectOption,
    checkLevelCompletion,
    nextLevel,
    completeGame,
    restartGame,
    resetCurrentLevel,
    goToLevel,
    getOptionById,
    isOptionSelected,
    isOptionCorrect,
    getOptionStatus,
  }
})
