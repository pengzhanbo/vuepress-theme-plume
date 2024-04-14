<script setup lang="ts">
import { useWaterMark } from '../composables/index.js'

const {
  enableWatermark,
  isFullPage,
  svgElRef,
  svgRect,
  imageUrl,
  content,
  textColor,
  rotateStyle,
  imageBase64,
  watermarkUrl,
  onlyPrint,
} = useWaterMark()
</script>

<template>
  <div
    v-if="enableWatermark"
    class="watermark-wrapper"

    :class="{ full: isFullPage, print: onlyPrint }"
    :style="{ backgroundImage: `url(${watermarkUrl})` }"
  >
    <div ref="svgElRef" class="watermark">
      <svg
        :viewBox="`0 0 ${svgRect.svgWidth} ${svgRect.svgHeight}`"
        :width="svgRect.svgWidth"
        :height="svgRect.svgHeight"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        :style="{
          padding: `0 ${svgRect.gapX}px ${svgRect.gapY}px 0`,
          opacity: svgRect.opacity,
        }"
      >
        <image
          v-if="imageUrl"
          :href="imageBase64"
          :xlink:href="imageBase64"
          x="0"
          y="0"
          :width="svgRect.width"
          :height="svgRect.height"
          :style="rotateStyle"
        />
        <foreignObject
          v-else
          x="0"
          y="0"
          :width="svgRect.width"
          :height="svgRect.height"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            :style="rotateStyle"
          >
            <p class="watermark-content" :style="{ color: textColor }" v-html="content" />
          </div>
        </foreignObject>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.watermark-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 19;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: transparent;
  background-repeat: repeat;
}

.watermark-wrapper .watermark {
  display: none;
}

.watermark-wrapper.full {
  position: fixed;
  top: var(--vp-nav-height);
  z-index: 9999;
}

.watermark-wrapper .watermark-content {
  display: inline-block;
  margin: 0;
}

.watermark-wrapper.print {
  display: none;
}

@media print {
  .watermark-wrapper.print {
    display: block;
  }
}
</style>
