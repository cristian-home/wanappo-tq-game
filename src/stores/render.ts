import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRenderStore = defineStore('render', () => {
  const isInitialRender = ref(true)

  return { isInitialRender }
})
