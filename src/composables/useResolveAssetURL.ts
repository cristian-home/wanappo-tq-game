import { computed, type Ref } from 'vue'

export function useResolveAssetUrl(assetName: string | Ref<string>, basePath = '../assets/') {
  return computed(() => {
    let name = typeof assetName === 'string' ? assetName : assetName.value

    if (!name) {
      return ''
    }

    try {
      if (name.startsWith('http') || name.startsWith('https')) {
        return name
      }

      if (name.startsWith('/')) {
        name = name.slice(1)
      }

      return new URL(`${basePath}${name}`, import.meta.url).href
    } catch (e) {
      console.warn('Error resolviendo URL de imagen:', e)
      return ''
    }
  })
}
