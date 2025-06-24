<script setup lang="ts">
import { useRouter } from 'vue-router'
import ErrorIcon from '@/assets/img/ErrorIcon.svg'

const router = useRouter()

const onClickBack = () => {
  router.push({ name: 'game-home' })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen p-8 gap-8">
    <ErrorIcon class="h-32 w-32 text-red-700" />
    <h1 class="text-red-700 text-2xl">Esta página no existe</h1>
    <button class="btn btn-large" @click="onClickBack">Volver al Inicio</button>
  </div>
</template>
