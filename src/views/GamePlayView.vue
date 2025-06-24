<script setup lang="ts">
import GameHeaderLabel from '@/components/game/GameHeaderLabel.vue'
import LogoCapaCremosa from '@/assets/img/options/LogoCapaCremosa.webp'
import { computed, ref, watch } from 'vue'

interface Option {
  id: number
  isCorrect: boolean
  text?: string
  imageUrl?: string
  isSelected: boolean
}

const levelCompleted = ref(false)

// const level = ref(1)

const question = ref('Completa el empaque, faltan 3 elementos.')

const options = ref<Option[]>([
  {
    id: 1,
    isCorrect: true,
    text: 'Opción 1',
    imageUrl: LogoCapaCremosa,
    isSelected: false,
  },
  {
    id: 2,
    isCorrect: true,
    text: 'Opción 2',
    imageUrl: LogoCapaCremosa,
    isSelected: false,
  },
  {
    id: 3,
    isCorrect: false,
    text: 'Opción 3',
    imageUrl: LogoCapaCremosa,
    isSelected: false,
  },
  {
    id: 4,
    isCorrect: false,
    text: 'Opción 4',
    imageUrl: LogoCapaCremosa,
    isSelected: false,
  },
])

const randomOrderedOptions = computed(() => {
  return [...options.value].sort(() => Math.random() - 0.5)
})

const wrongSelectedOptions = computed(() => {
  return options.value.filter((option) => option.isSelected && !option.isCorrect)
})

const correctOptionsLeft = computed(() => {
  return options.value.filter((option) => option.isCorrect && !option.isSelected)
})

const selectOption = (option: Option) => {
  if (option.isCorrect && option.isSelected) {
    return
  }

  if (option.isSelected) {
    option.isSelected = false
  } else {
    wrongSelectedOptions.value.forEach((wrongOption) => {
      wrongOption.isSelected = false
    })

    option.isSelected = true
  }
}

const stopWatcher = watch(
  correctOptionsLeft,
  (newValue) => {
    if (newValue.length === 0) {
      levelCompleted.value = true
      setTimeout(() => {
        alert('¡Felicidades! Has completado el empaque correctamente.')
      }, 500)
      stopWatcher()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative w-dvw h-dvh flex flex-col items-center justify-center p-8">
    <div class="w-xl max-w-full flex flex-col items-center justify-center gap-16">
      <GameHeaderLabel class="w-96 max-w-full"> {{ question }} </GameHeaderLabel>
      <img
        src="@/assets/img/products/crema-no4-protect.webp"
        alt="Game Background"
        class="max-w-full w-96 object-cover drop-shadow-xl"
      />
      <div class="grid grid-cols-2 gap-x-10 gap-y-8 w-full">
        <button
          class="btn"
          v-for="option in randomOrderedOptions"
          :key="option.id"
          :class="{
            'btn-success': option.isCorrect && option.isSelected,
            'btn-danger': !option.isCorrect && option.isSelected,
          }"
          :disabled="levelCompleted"
          @click="selectOption(option)"
        >
          <img
            v-if="option.imageUrl"
            :src="option.imageUrl"
            alt="Option Image"
            class="w-full object-contain"
          />
          <span v-else>{{ option.text }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
