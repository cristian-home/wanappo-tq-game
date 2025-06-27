<script setup lang="ts">
import { RouterView } from 'vue-router'
import { motion, AnimatePresence } from 'motion-v'
import TqLogo from './assets/img/TqLogo.svg'
import N4Logo from './assets/img/N4Logo.svg'
import { onMounted } from 'vue'
import { useRenderStore } from '@/stores/render'
import { nextTick } from 'vue'

const renderStore = useRenderStore()

onMounted(() => {
  setTimeout(() => {
    nextTick(() => {
      renderStore.isInitialRender = false
    })
  }, 0)
})
</script>

<template>
  <main class="relative h-dvh w-full">
    <motion.div
      class="fixed top-0 left-0 flex h-20 w-full items-center justify-between p-4"
      :initial="{ opacity: 0, y: -100 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: 0.3 }"
    >
      <TqLogo class="h-full max-w-1/2" />
      <motion.div class="h-full max-w-1/2" v-if="$route.name !== 'game-home'">
        <motion.div
          class="h-full max-w-full"
          layoutId="logo"
          :transition="{ duration: 0.5, ease: 'backInOut' }"
        >
          <N4Logo class="h-full max-w-full" />
        </motion.div>
      </motion.div>
    </motion.div>

    <RouterView v-slot="{ Component }">
      <AnimatePresence>
        <motion.div
          class="relative m-0 h-dvh w-full p-0"
          layout
          :transition="{ duration: 0.5, ease: 'easeInOut' }"
        >
          <component :is="Component" />
        </motion.div>
      </AnimatePresence>
    </RouterView>
    <div class="pointer-events-none fixed bottom-0 -z-1 flex w-full flex-col items-center">
      <img src="@/assets/img/bottom-t.webp" alt="Bottom T" class="-mb-[5%] w-10/12 opacity-50" />
      <div class="relative w-full">
        <img src="@/assets/img/bottom-b.webp" alt="Bottom B" class="w-full opacity-50" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-50"></div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
