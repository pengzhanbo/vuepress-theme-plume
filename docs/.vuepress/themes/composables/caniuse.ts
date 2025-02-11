import type { Ref } from 'vue'
import { onClickOutside, useDebounceFn, useEventListener, useLocalStorage } from '@vueuse/core'
import { computed, onMounted, readonly, ref, watch } from 'vue'

interface Feature {
  label: string
  value: string
}

interface SelectItem {
  label: string
  value: string
}

const api = 'https://caniuse.pengzhanbo.cn/features.json'

const pastVersions: SelectItem[] = [
  { label: '不显示旧版本', value: '0' },
  ...Array.from({ length: 5 }).fill(0).map((_, i) => ({
    label: `旧版本（当前版本 - ${i + 1}）`,
    value: `${i + 1}`,
  })),
]

const futureVersions: SelectItem[] = [
  { label: '不显示未来版本', value: '0' },
  ...Array.from({ length: 3 }).fill(0).map((_, i) => ({
    label: `未来版本（当前版本 + ${i + 1}）`,
    value: `${i + 1}`,
  })),
]

const embedTypes: SelectItem[] = [
  { label: 'iframe', value: '' },
  { label: 'image', value: 'image' },
]

export function useCaniuseVersionSelect() {
  const past = ref('2')
  const future = ref('1')
  const embedType = ref('')

  const pastList = readonly(pastVersions)
  const futureList = readonly(futureVersions)
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
) {
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

  function onSelect(item: Feature) {
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
}) {
  const output = computed(() => {
    let content = '@[caniuse'
    if (embedType.value)
      content += ` ${embedType.value}`

    if (past.value !== '-2' || future.value !== '1') {
      if (past.value === '0' && future.value === '0')
        content += '{0}'
      else
        content += `{-${past.value},${future.value}}`
    }

    content += ']('

    if (feature.value)
      content += feature.value

    return `${content})`
  })

  const rendered = computed(() => {
    if (!feature.value || !embedType.value)
      return ''
    return resolveCanIUse(feature.value)
  })

  return { output, rendered }
}

function resolveCanIUse(feature: string): string {
  const link = 'https://caniuse.bitsofco.de/image/'
  const alt = `Data on support for the ${feature} feature across the major browsers from caniuse.com`
  return `<p><picture>
    <source type="image/webp" srcset="${link}${feature}.webp">
    <source type="image/png" srcset="${link}${feature}.png">
    <img src="${link}${feature}.jpg" alt="${alt}" width="100%">
  </picture></p>`
}
