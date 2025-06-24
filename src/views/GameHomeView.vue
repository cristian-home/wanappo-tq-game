<script setup lang="ts">
import N4Logo from '@/assets/img/N4Logo.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

const onClickStart = () => {
  router.push({ name: 'game-play' })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen p-8 gap-16">
    <N4Logo class="h-32 max-w-full" />
    <button class="btn btn-large" @click="onClickStart">INICIO</button>
  </div>
</template>
