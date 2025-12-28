import type { ComputedRef, Ref } from 'vue'
import type { LocaleConfig } from 'vuepress'
import { onClickOutside, useDebounceFn, useEventListener, useLocalStorage } from '@vueuse/core'
import { computed, onMounted, readonly, ref, watch } from 'vue'
import { useRouteLocale } from 'vuepress/client'

interface Feature {
  label: string
  value: string
}

interface SelectItem {
  label: string
  value: string
}

const api = 'https://caniuse.pengzhanbo.cn/features.json'

const locales: LocaleConfig<
  Record<'past0' | 'pastIndex' | 'future0' | 'futureIndex', string>
> = {
  '/': {
    past0: '不显示旧版本',
    pastIndex: '旧版本（当前版本 - {index}）',
    future0: '不显示未来版本',
    futureIndex: '未来版本（当前版本 + {index}）',
  },
  '/en/': {
    past0: 'Do not show old versions',
    pastIndex: 'Old version (current version - {index})',
    future0: 'Do not show future versions',
    futureIndex: 'Future version (current version + {index})',
  },
}

const embedTypes: SelectItem[] = [
  { label: 'caniuse', value: '' },
  { label: 'baseline', value: 'baseline' },
]

export function useCaniuseVersionSelect(): {
  past: Ref<string>
  future: Ref<string>
  embedType: Ref<string>
  pastList: ComputedRef<SelectItem[]>
  futureList: ComputedRef<SelectItem[]>
  embedTypeList: Readonly<SelectItem[]>
} {
  const routeLocale = useRouteLocale()

  const past = ref('2')
  const future = ref('1')
  const embedType = ref('')

  const pastList = computed(() => {
    return [
      { label: locales[routeLocale.value].past0 || '', value: '0' },
      ...Array.from({ length: 5 }).fill(0).map((_, i) => ({
        label: locales[routeLocale.value]?.pastIndex?.replace('{index}', `${i + 1}`) ?? '',
        value: `${i + 1}`,
      })),
    ]
  })
  const futureList = computed(() => {
    return [
      { label: locales[routeLocale.value].future0 || '', value: '0' },
      ...Array.from({ length: 3 }).fill(0).map((_, i) => ({
        label: locales[routeLocale.value]?.futureIndex?.replace('{index}', `${i + 1}`) ?? '',
        value: `${i + 1}`,
      })),
    ]
  })
  const embedTypeList = readonly(embedTypes)

  return {
    past,
    future,
    pastList,
    futureList,
    embedType,
    embedTypeList,
  }
}

export function useCaniuseFeaturesSearch(
  inputEl: Ref<HTMLInputElement | null>,
  listEl: Ref<HTMLUListElement | null>,
): {
  featureList: Ref<Feature[] | undefined>
  isFocus: Ref<boolean>
  feature: ComputedRef<string>
  onSelect: (item: Feature) => void
} {
  const features = useLocalStorage('plume:caniuse-feature-list', [] as Feature[])
  const featuresUpdated = useLocalStorage('plume:caniuse-feature-list-updated', Date.now())
  const maxAge = 1000 * 60 * 60 * 24 * 3 // 3 days
  onMounted(async () => {
    if (typeof document === 'undefined')
      return

    if (features.value.length && Date.now() - featuresUpdated.value < maxAge)
      return
    const data = await fetch(api).then(res => res.json())
    features.value = data || features.value || []
  })

  const input = ref('')
  const isFocus = ref(false)
  const searched = ref<Feature[]>()

  const selected = ref<Feature | null>(null)

  watch(() => [features.value, isFocus.value], () => {
    if (!isFocus.value)
      searched.value = features.value
  }, { immediate: true })

  onClickOutside(listEl, () => {
    isFocus.value = false
  }, { ignore: [inputEl] })

  useEventListener(inputEl, 'input', useDebounceFn(() => {
    selected.value = null
    input.value = inputEl.value?.value || ''

    if (!input.value) {
      searched.value = features.value
    }
    else {
      searched.value = features.value.filter(item => item.label.includes(input.value) || item.value.includes(input.value))
      if (searched.value.length === 1)
        selected.value = searched.value[0]
    }
  }, 500))

  useEventListener(inputEl, 'focus', () => {
    isFocus.value = true
  })

  function onSelect(item: Feature): void {
    selected.value = item
    isFocus.value = false
    if (inputEl.value)
      inputEl.value.value = item.label
  }

  return {
    featureList: searched,
    isFocus,
    onSelect,
    feature: computed(() => selected.value?.value || ''),
  }
}

export function useCaniuse({ feature, embedType, past, future }: {
  feature: Ref<string>
  embedType: Ref<string>
  past: Ref<string>
  future: Ref<string>
}): {
  output: ComputedRef<string>
} {
  const output = computed(() => {
    let content = '@[caniuse'
    if (embedType.value)
      content += ` ${embedType.value}`

    if (embedType.value !== 'baseline') {
      if (past.value !== '-2' || future.value !== '1') {
        if (past.value === '0' && future.value === '0')
          content += '{0}'
        else
          content += `{-${past.value},${future.value}}`
      }
    }

    content += ']('

    if (feature.value)
      content += feature.value

    return `${content})`
  })

  return { output }
}
