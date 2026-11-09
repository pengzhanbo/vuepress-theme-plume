import type { ComputedRef, Ref } from 'vue'
import type { BulletinOptions } from '../../shared/index.js'
import { bulletinData as rawBulletinData } from '@internal/bulletin-data'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { useData } from './data.js'

const showBulletin = ref(false)

const bulletinData = ref(rawBulletinData)

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateBulletinData = (data: Record<string, BulletinOptions>) => {
    bulletinData.value = data
  }
}

export function useBulletin<T extends Record<string, any> = Record<string, any>>(): ComputedRef<BulletinOptions & T> {
  const locale = useRouteLocale()
  const bulletin = computed(() => bulletinData.value[locale.value] || {})

  return bulletin as ComputedRef<BulletinOptions & T>
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
  const enableBulletin = computed(() => (page.value.bulletin ?? true) && Object.keys(bulletin.value).length > 0)

  watch(() => bulletin.value.lifetime, (lifetime) => {
    const id = bulletin.value.id
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
    const lifetime = bulletin.value.lifetime
    const id = bulletin.value.id

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
