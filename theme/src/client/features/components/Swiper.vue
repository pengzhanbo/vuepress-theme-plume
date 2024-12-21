<script setup lang="ts">
import type { AutoplayOptions, SwiperModule, Swiper as SwiperType } from 'swiper/types'
import { useMutationObserver } from '@vueuse/core'
import {
  Autoplay,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  EffectCube,
  EffectFade,
  EffectFlip,
  Mousewheel,
  Navigation,
  Pagination,
} from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, onMounted } from 'vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import 'swiper/css/effect-cube'
import 'swiper/css/effect-flip'
import 'swiper/css/effect-coverflow'
import 'swiper/css/effect-cards'
import 'swiper/css/effect-creative'

interface SlideItem {
  /**
   * 图片地址
   */
  link: string
  /**
   * 跳转链接
   */
  href?: string
  alt?: string
}

interface Props {
  items?: (string | SlideItem)[]
  width?: number | string // 轮播区域宽度，单位 px
  height?: number | string // 轮播区域高度，单位 px
  mode?: 'banner' | 'carousel' | 'broadcast' // banner: 轮播图模式; carousel: 走马灯模式; broadcast: 信息展播模式
  navigation?: boolean // 是否显示导航
  effect?: 'slide' | 'fade' | 'cube' | 'flip' | 'coverflow' | 'cards' | 'creative' // 切换动画效果
  delay?: number // 自动切换的时间间隔，仅当 mode: 'banner' 时生效，单位 ms
  speed?: number // 切换过渡的动画持续时间，单位 ms
  loop?: boolean // 是否循环切换
  pauseOnMouseEnter?: boolean // 当鼠标移入走马灯时，是否暂停自动轮播，仅当 mode: 'banner' 或 mode: 'carousel' 时生效
  swipe?: boolean // 是否可以鼠标拖动
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  mode: 'banner',
  navigation: true,
  effect: 'slide',
  delay: 3000,
  speed: 300,
  loop: true,
  pauseOnMouseEnter: false,
  swipe: true,
})

const slideList = computed<SlideItem[]>(() => {
  return props.items?.map((link) => {
    if (typeof link === 'string')
      return { link }

    return link
  }) ?? []
})

function parseSize(size: number | string) {
  if (typeof size === 'number') {
    return `${size}px`
  }
  return size
}

const styles = computed(() => ({
  width: parseSize(props.width),
  height: parseSize(props.height),
}))

const modules = computed<SwiperModule[]>(() => {
  if (props.mode === 'carousel')
    return [Autoplay]

  if (props.mode === 'broadcast')
    return [Navigation, Pagination, Mousewheel]

  const modules: SwiperModule[] = [Navigation, Pagination, Autoplay]
  const effectMoudles = {
    fade: EffectFade,
    cube: EffectCube,
    flip: EffectFlip,
    coverflow: EffectCoverflow,
    cards: EffectCards,
    creative: EffectCreative,
  }
  if (props.effect !== 'slide') {
    modules.push(effectMoudles[props.effect])
  }
  return modules
})

const autoplay = computed<AutoplayOptions | boolean>(() => {
  if (props.mode === 'banner') {
    return {
      delay: props.delay,
      disableOnInteraction: false, // 用户操作 swiper 之后，是否禁止 autoplay。默认为 true：停止。
      pauseOnMouseEnter: props.pauseOnMouseEnter, // 鼠标置于 swiper 时暂停自动切换，鼠标离开时恢复自动切换，默认 false
    }
  }
  else if (props.mode === 'carousel') {
    return {
      delay: 0,
      disableOnInteraction: false,
    }
  }
  return false
})

const hasNavigation = computed(() =>
  props.mode === 'banner' || props.mode === 'broadcast' ? props.navigation : false,
)

let swiper: SwiperType
function onSwiper(_swiper: SwiperType) {
  swiper = _swiper
  if (props.mode === 'carousel' && props.pauseOnMouseEnter) {
    swiper.el.onmouseenter = () => swiper!.autoplay.stop()
    swiper.el.onmouseleave = () => swiper!.autoplay.start()
  }
}

onMounted(() => {
  if (props.mode === 'carousel' && !props.pauseOnMouseEnter) {
    useMutationObserver(() => document.documentElement, () => {
      if (!swiper)
        return

      swiper.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)'
      setTimeout(() => swiper.update(), 350)
    }, { attributeFilter: ['data-theme'] })
  }
})
</script>

<template>
  <ClientOnly>
    <Swiper
      class="vp-swiper"
      :class="{ 'swiper-no-swiping': mode === 'banner' ? !swipe : mode === 'carousel' }"
      :style="styles"
      :modules="modules"
      :autoplay="autoplay"
      :navigation="hasNavigation"
      :pagination="props.mode !== 'carousel' ? {
        dynamicBullets: true,
        clickable: true,
      } : false"
      :speed="speed"
      :loop="loop"
      :effect="mode === 'banner' ? effect : 'slide'"
      lazy
      v-bind="$attrs"
      @swiper="onSwiper"
    >
      <SwiperSlide v-for="(item, index) in slideList" :key="item.link + index">
        <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer" class="swiper-slide-link no-icon">
          <img class="swiper-slide-img" :src="item.link" :alt="item.alt" loading="lazy">
        </a>
        <img v-else class="swiper-slide-img" :src="item.link" :alt="item.alt" loading="lazy">
      </SwiperSlide>
    </Swiper>
  </ClientOnly>
</template>

<style>
.vp-swiper {
  margin: 24px 0;
}

.swiper-slide-link {
  display: block;
  height: 100%;
}

.swiper-slide-img {
  width: 100%;
  height: 100%;
  cursor: default !important;

  object-fit: cover;
}

.swiper-slide-link .swiper-slide-img {
  cursor: pointer !important;
}

.swiper {
  --swiper-theme-color: var(--vp-c-bg);
  --swiper-pagination-bullet-inactive-color: var(--vp-c-bg);
  --swiper-pagination-bullet-inactive-opacity: 0.4;
}

.swiper-wrapper {
  -webkit-transition-timing-function: linear;
  transition-timing-function: linear;
}

.swiper-pagination-bullet {
  width: 12px;
  height: 12px;
}
</style>
