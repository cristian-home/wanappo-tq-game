<script setup lang="ts">
import N4Face from '@/assets/img/N4Face.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

const onClickBack = () => {
  router.push({ name: 'game-home' })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen p-8 gap-8">
    <N4Face class="h-48 max-w-full" />
    <img
      src="@/assets/img/LogoGanaste.webp"
      alt="Logo Ganaste"
      class="h-24 max-w-full object-contain"
    />
    <button class="btn btn-large" @click="onClickBack">Volver al Inicio</button>
  </div>
</template>
