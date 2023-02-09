import { computed } from 'vue'

export function useSidebar() {
  const hasSidebar = computed(() => {
    return false
  })

  return {
    hasSidebar,
  }
}
