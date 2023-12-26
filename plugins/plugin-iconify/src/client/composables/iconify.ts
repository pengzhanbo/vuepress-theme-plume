import type { IconifyIcon } from '@iconify/vue'
import { loadIcon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

const iconCache: Ref<Record<string, IconifyIcon>> = ref({})

export function useIconify(name: ComputedRef<string> | Ref<string>) {
  const icon = computed(() => iconCache.value[name.value])
  const loaded = ref(true)

  async function loadIconComponent() {
    if (icon.value)
      return

    if (!__VUEPRESS_SSR__) {
      try {
        loaded.value = false
        iconCache.value[name.value] = await loadIcon(name.value)
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
