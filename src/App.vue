<script setup lang="ts">
import { RouterView } from 'vue-router'
import TqLogo from './assets/img/TqLogo.svg'
import N4Logo from './assets/img/N4Logo.svg'
</script>

<template>
  <main class="w-full h-dvh">
    <TqLogo class="max-w-1/3 h-16 fixed top-8 left-8" />
    <N4Logo class="max-w-1/3 h-16 fixed top-8 right-8" />
    <RouterView />
    <div class="-z-1 fixed bottom-0 w-full flex flex-col items-center pointer-events-none">
      <img src="@/assets/img/bottom-t.webp" alt="Bottom T" class="w-10/12 -mb-[5%]" />
      <img src="@/assets/img/bottom-b.webp" alt="Bottom B" class="w-full" />
    </div>
  </main>
</template>

<style scoped></style>
