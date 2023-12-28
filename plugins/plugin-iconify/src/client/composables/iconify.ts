import type { IconifyIcon } from '@iconify/vue'
import { loadIcon } from '@iconify/vue'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export function useIconify(name: Ref<string>) {
  const icon = ref<IconifyIcon | null>(null)
  const loaded = ref(false)

  async function loadIconComponent() {
    if (icon.value)
      return

    if (!__VUEPRESS_SSR__) {
      try {
        loaded.value = false
        const cached = await loadIcon(name.value)
        icon.value = cached
      }
      finally {
        loaded.value = true
      }
    }
    else {
      loaded.value = true
    }
  }

  watch(() => name.value, loadIconComponent, { immediate: true })

  return { icon, loaded }
}
