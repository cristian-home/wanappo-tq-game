import { defineStore } from 'pinia'
import { useSound } from '@vueuse/sound'
import { ref } from 'vue'
import { useResolveAssetUrl } from '@/composables/useResolveAssetURL'

export const useSoundStore = defineStore('sound', () => {
  // State
  const isBackgroundMusicPlaying = ref(false)

  // Resolve audio asset URLs
  const bgMusicUrl = useResolveAssetUrl('sounds/bg1.ogg')
  const startGameUrl = useResolveAssetUrl('sounds/start.ogg')
  const rightAnswerUrl = useResolveAssetUrl('sounds/right.ogg')
  const wrongAnswerUrl = useResolveAssetUrl('sounds/wrong.ogg')
  const levelUpUrl = useResolveAssetUrl('sounds/level-up.ogg')
  const gameWinUrl = useResolveAssetUrl('sounds/level-up.ogg') // Using level-up.ogg for game win

  // Load background music
  const {
    play: playBg,
    stop: stopBg,
    isPlaying: isBgPlaying,
  } = useSound(bgMusicUrl, {
    loop: true,
    volume: 0.5,
  })

  // Load sound effects
  const { play: playStartGame } = useSound(startGameUrl, { volume: 0.7 })
  const { play: playRightAnswer } = useSound(rightAnswerUrl, { volume: 0.7 })
  const { play: playWrongAnswer } = useSound(wrongAnswerUrl, { volume: 0.7 })
  const { play: playLevelUp } = useSound(levelUpUrl, { volume: 0.9 })
  const { play: playGameWin } = useSound(gameWinUrl, { volume: 0.9 })

  // Actions
  const startBackgroundMusic = () => {
    if (!isBackgroundMusicPlaying.value && !isBgPlaying.value) {
      playBg()
      isBackgroundMusicPlaying.value = true
    }
  }

  const stopBackgroundMusic = () => {
    if (isBackgroundMusicPlaying.value) {
      stopBg()
      isBackgroundMusicPlaying.value = false
    }
  }

  const toggleBackgroundMusic = () => {
    if (isBackgroundMusicPlaying.value) {
      stopBackgroundMusic()
    } else {
      startBackgroundMusic()
    }
  }

  // Sound effect actions
  const playStartGameSound = () => {
    playStartGame()
  }

  const playRightAnswerSound = () => {
    playRightAnswer()
  }

  const playWrongAnswerSound = () => {
    playWrongAnswer()
  }

  const playLevelUpSound = () => {
    playLevelUp()
  }

  const playGameWinSound = () => {
    playGameWin()
  }

  return {
    // State
    isBackgroundMusicPlaying,
    isBgPlaying,

    // Background Music Actions
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,

    // Sound Effect Actions
    playStartGameSound,
    playRightAnswerSound,
    playWrongAnswerSound,
    playLevelUpSound,
    playGameWinSound,
  }
})
