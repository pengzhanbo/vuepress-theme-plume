<script setup lang="ts">
import type ArtPlayer from 'artplayer'
import type { Option as ArtPlayerInitOptions } from 'artplayer'
import { isLinkHttp } from '@vuepress/helper/client'
import { useCssVar } from '@vueuse/core'
import { onMounted, onUnmounted, ref, toRefs } from 'vue'
import { usePageLang, withBase } from 'vuepress/client'
import { useSize } from '../composables/size.js'
import { ART_PLAYER_SUPPORTED_VIDEO_TYPES, installed } from '../options.js'
import Loading from './icons/Loading.vue'

type CustomType = Record<string, (this: ArtPlayer, video: HTMLVideoElement, url: string, art: ArtPlayer) => any>

const props = withDefaults(defineProps<{
  src: string
  type?: string
  width?: string
  height?: string
  ratio?: string
} & Omit<ArtPlayerInitOptions, 'container' | 'url' | 'type'>>(), {
  hotkey: true,
  mutex: true,
  playsInline: true,
})

const loaded = ref(false)
const lang = usePageLang()
const brandColor = useCssVar('--vp-c-brand-1')
const { el, width, height, resize } = useSize<HTMLDivElement>(toRefs(props))

let player: ArtPlayer | null = null

async function createPlayer() {
  if (__VUEPRESS_SSR__)
    return

  if (!el.value)
    return

  loaded.value = false
  const { default: ArtPlayer } = await import(
    /* webpackChunkName: "artplayer" */ 'artplayer',
  )
  loaded.value = true
  const { src, type: _t, width: _w, height: _h, ratio: _r, ...opt } = props
  const { customType = {}, ...options } = opt
  Object.keys(options).forEach((key) => {
    if (typeof options[key] === 'undefined') {
      delete options[key]
    }
  })
  const type = props.type ?? src.split('.').pop() ?? ''
  const url = isLinkHttp(src) ? src : withBase(src)

  if (!ART_PLAYER_SUPPORTED_VIDEO_TYPES.includes(type)) {
    console.error(`Unsupported video type: ${type}`)
    return
  }

  player = new ArtPlayer({
    container: el.value,
    url,
    type,
    ...{
      lang: lang.value.split('-')[0] === 'zh' ? 'zh-cn' : 'en',
      volume: 0.75,
      useSSR: false,
      theme: brandColor.value ?? '#5086a1',
    },
    ...options,
    customType: {
      ...initCustomType(type),
      ...customType,
    },
  })
}

function initCustomType(type: string): CustomType {
  const customType: CustomType = {}

  if ((type === 'mpd' || type === 'dash') && installed.dashjs) {
    customType[type] = async function (video, url, art) {
      const { supportsMediaSource, MediaPlayer } = (await import(/* webpackChunkName: "dashjs" */ 'dashjs'))
      if (supportsMediaSource()) {
        const dashPlayer = MediaPlayer().create()
        dashPlayer.initialize(video, url, props.autoplay, 0)
        art.on('destroy', () => dashPlayer.destroy())
      }
    }
  }

  if (type === 'm3u8' || type === 'hls') {
    customType[type] = async function (video, url, art) {
      if (video.canPlayType('application/x-mpegURL')
        || video.canPlayType('application/vnd.apple.mpegURL')) {
        video.src = url
        return
      }
      if (!installed.hlsjs)
        return

      const Hls = (await import(/* webpackChunkName: "hls.js" */ 'hls.js')).default
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.attachMedia(video)
        hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(url))
        art.on('destroy', () => hls.destroy())
      }
    }
  }

  if ((type === 'ts' || type === 'flv') && installed.mpegtsjs) {
    customType[type] = async function (video, url, art) {
      const mpegts = (await import(/* webpackChunkName: "mpegts.js" */ 'mpegts.js/dist/mpegts.js')).default
      if (mpegts.isSupported()) {
        const flv = mpegts.createPlayer({ type: 'flv', url })

        flv.attachMediaElement(video)
        flv.load()
        art.on('destroy', () => flv.destroy())
      }
    }
  }

  return customType
}

onMounted(async () => {
  await createPlayer()
  resize()
})

onUnmounted(() => {
  player?.destroy()
  player = null
})
</script>

<template>
  <div class="vp-artplayer-wrapper">
    <div ref="el" class="vp-artplayer" :style="{ width, height }" />
    <Loading v-if="!loaded" absolute />
  </div>
</template>

<style>
.vp-artplayer-wrapper {
  position: relative;
}

.vp-artplayer {
  margin: 16px 0;
}

@media (min-width: 768px) {
  .vp-artplayer {
    overflow: hidden;
    border-radius: 8px;
    box-shadow: var(--vp-shadow-2);
    transition: box-shadow var(--vp-t-color);
  }
}

.vp-artplayer .art-video-player .art-subtitle {
  z-index: 12;
}

.vp-artplayer .art-video-player .art-danmuku {
  z-index: 13;
}

.vp-artplayer .art-video-player .art-layers {
  z-index: 14;
}

.vp-artplayer .art-video-player .art-mask {
  z-index: 15;
}

.vp-artplayer .art-video-player .art-bottom {
  z-index: 16;
}

.vp-artplayer .art-video-player .art-loading {
  z-index: 17;
}

.vp-artplayer .art-video-player .art-notice {
  z-index: 18;
}

.vp-artplayer .art-video-player .art-settings {
  z-index: 19;
}

.vp-artplayer .art-video-player .art-info {
  z-index: 20;
}

.vp-artplayer .art-video-player .art-contextmenu {
  z-index: 21;
}
</style>
