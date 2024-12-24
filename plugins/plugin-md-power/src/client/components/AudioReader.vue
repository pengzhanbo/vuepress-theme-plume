<script setup lang="ts">
import { useInterval } from '@vueuse/core'
import { onMounted, toRef, watch } from 'vue'
import { useAudioPlayer } from '../composables/audio.js'

const props = defineProps<{
  src: string
  autoplay?: boolean
  type?: string
  volume?: number
  startTime?: number
  endTime?: number
}>()

const { paused, play, pause, seek, setVolume } = useAudioPlayer(
  toRef(() => props.src),
  {
    type: toRef(() => props.type || ''),
    autoplay: props.autoplay,
    oncanplay: () => {
      if (props.startTime) {
        seek(props.startTime)
      }
    },
    ontimeupdate: (time) => {
      if (props.endTime && time >= props.endTime) {
        pause()
        if (props.startTime) {
          seek(props.startTime)
        }
      }
    },
  },
)
const interval = useInterval(300, { controls: true, immediate: false })

watch(paused, () => {
  if (paused.value) {
    interval.pause()
  }
})

function opacity(mo: number) {
  return paused.value ? 1 : (interval.counter.value % 3 >= mo ? 1 : 0)
}

function toggle() {
  if (paused.value) {
    play()
    interval.reset()
    interval.resume()
  }
  else {
    pause()
  }
}

onMounted(() => {
  watch(() => props.volume, (volume) => {
    if (typeof volume !== 'undefined') {
      setVolume(volume)
    }
  }, { immediate: true })
})
</script>

<template>
  <span class="vp-audio-reader" @click="toggle">
    <slot />
    <span class="icon-audio">
      <svg fill="currentcolor" width="16" height="16" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill-rule="evenodd"><path d="M24.1538 5.86289C24.8505 5.23954 25.738 4.95724 26.6005 5.00519C27.463 5.05313 28.3137 5.43204 28.9371 6.12878C29.4928 6.74989 29.8 7.55405 29.8 8.38746V46.28C29.8 47.2149 29.4186 48.0645 28.8078 48.6754C28.197 49.2862 27.3474 49.6675 26.4125 49.6675C25.5843 49.6675 24.7848 49.3641 24.1651 48.8147L13.0526 38.9618C12.5285 38.4971 11.8523 38.2405 11.1518 38.2405H5.3875C4.45261 38.2405 3.603 37.8591 2.99218 37.2483C2.38135 36.6375 2 35.7879 2 34.853V19.7719C2 18.837 2.38135 17.9874 2.99218 17.3766C3.603 16.7658 4.45262 16.3844 5.3875 16.3844H11.2991C12.004 16.3844 12.6841 16.1246 13.2095 15.6546L24.1538 5.86289ZM25.8 9.75731L15.8766 18.6356C14.6178 19.7618 12.9881 20.3844 11.2991 20.3844H6V34.2405H11.1518C12.8302 34.2405 14.4505 34.8553 15.7064 35.9688L25.8 44.9184V9.75731Z" /><path :style="{ opacity: opacity(1) }" d="M38.1519 17.8402L36.992 16.2108L33.7333 18.5304L34.8931 20.1598C36.2942 22.1281 37.1487 24.6457 37.1487 27.4131C37.1487 30.1933 36.2862 32.7214 34.8736 34.6937L33.709 36.3197L36.9609 38.6488L38.1255 37.0229C40.0285 34.366 41.1487 31.0221 41.1487 27.4131C41.1487 23.8207 40.0388 20.4911 38.1519 17.8402Z" /><path :style="{ opacity: opacity(2) }" d="M43.617 8.17398L44.9714 9.64556C49.0913 14.1219 51.6179 20.3637 51.6179 27.2257C51.6179 34.0838 49.0943 40.3223 44.9787 44.798L43.6249 46.2702L40.6805 43.5627L42.0343 42.0905C45.4542 38.3714 47.6179 33.1061 47.6179 27.2257C47.6179 21.3419 45.4516 16.0739 42.0282 12.3544L40.6738 10.8828L43.617 8.17398Z" /></g></svg>
    </span>
  </span>
</template>

<style>
.vp-audio-reader {
  display: inline-block;
  color: currentcolor;
  cursor: pointer;
}

.vp-audio-reader .icon-audio {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  margin-left: 0.2em;
  vertical-align: middle;
}

.vp-audio-reader,
.vp-audio-reader .icon-audio {
  transition: color var(--vp-t-color);
}

.vp-audio-reader:hover,
.vp-audio-reader:hover .icon-audio {
  color: var(--vp-c-brand-1);
}
</style>
