import { computed, type Ref } from 'vue'

export function useResolveAssetUrl(assetName: string | Ref<string>) {
  return computed(() => {
    let name = typeof assetName === 'string' ? assetName : assetName.value

    if (!name) {
      return ''
    }

    try {
      // If it's already a full URL, return as is
      if (name.startsWith('http') || name.startsWith('https')) {
        return name
      }

      // Remove leading slash if present
      if (name.startsWith('/')) {
        name = name.slice(1)
      }

      // Use dynamic import for Vite's asset handling
      // This ensures proper asset processing during build
      const modules = import.meta.glob('../assets/**/*', {
        eager: true,
        query: '?url',
        import: 'default',
      }) as Record<string, string>

      const assetPath = `../assets/${name}`

      if (modules[assetPath]) {
        return modules[assetPath]
      }

      // Fallback: try with import.meta.url
      return new URL(assetPath, import.meta.url).href
    } catch (e) {
      console.warn('Error resolviendo URL de imagen:', e)
      return ''
    }
  })
}
