import type { ComputedRef, Ref } from 'vue'
import type { BulletinOptions } from '../../shared/index.js'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useData } from './data.js'

const showBulletin = ref(false)

export function useBulletin<T extends Record<string, any> = Record<string, any>>(): ComputedRef<BulletinOptions & T | undefined> {
  const { theme } = useData()
  const bulletin = computed(() => theme.value.bulletin === true ? {} : theme.value.bulletin)

  return bulletin as ComputedRef<BulletinOptions & T | undefined>
}

export function useBulletinControl<T extends Record<string, any> = Record<string, any>>(): {
  bulletin: ComputedRef<BulletinOptions & T | undefined>
  enableBulletin: ComputedRef<boolean>
  showBulletin: Ref<boolean>
  close: () => void
} {
  const session = useSessionStorage<string>('plume:bulletin', '')
  const local = useLocalStorage<string>('plume:bulletin', '')

  const { page } = useData()

  const bulletin = useBulletin<T>()
  const enableBulletin = computed(() => page.value.bulletin ?? true)

  watch(() => bulletin.value?.lifetime, (lifetime) => {
    const id = bulletin.value?.id
    if (lifetime === 'session') {
      showBulletin.value = session.value !== id
    }
    else if (lifetime === 'once') {
      showBulletin.value = local.value !== id
    }
    else {
      showBulletin.value = true
    }
  }, { immediate: true })

  function close() {
    showBulletin.value = false
    const lifetime = bulletin.value?.lifetime
    const id = bulletin.value?.id

    if (lifetime === 'session') {
      session.value = id!
    }
    else if (lifetime === 'once') {
      local.value = id!
    }
  }

  return {
    bulletin,
    enableBulletin,
    showBulletin,
    close,
  }
}
