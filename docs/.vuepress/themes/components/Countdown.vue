<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const deadline = new Date('2025-06-07T09:00:00.000')
const time = ref(deadline.getTime() - Date.now())

let intervalId: number

onMounted(() => {
  intervalId = window.setInterval(() => {
    time.value = deadline.getTime() - Date.now()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div>
    <div class="container">
      <div class="title">
        <div class="sub">
          距离2025年高考
        </div>
        <div class="main">
          还有
        </div>
      </div>
      <Card class="countdown">
        <div class="day">
          {{ Math.floor(time / 1000 / 60 / 60 / 24) }}<span class="char">天</span>
        </div>
        <div class="time">
          {{ String(Math.floor(time / 1000 / 60 / 60) % 24).padStart(2, '0') }}时
          {{ String(Math.floor(time / 1000 / 60) % 60).padStart(2, '0') }}分
          {{ String(Math.floor(time / 1000) % 60).padStart(2, '0') }}秒，
          共计 {{ Math.floor(time / 1000) }} 秒
        </div>
      </Card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1rem;
  align-items: center;
  width: min-content;
  height: auto;
  padding: 1rem;
  margin: 0.5rem auto 0;
  font-family: "Source Han Sans SC", "Source Han Sans", "Noto Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", "WenQuanYi Micro Hei", SimHei, sans-serif;
  cursor: default !important;
  user-select: none !important;

  .title {
    display: flex;
    flex-direction: column;
    justify-items: center;
    width: 21rem;
    text-align: right;

    .sub {
      font-size: 1.6rem;
      font-weight: bold;
      line-height: 1.8rem;
      color: var(--vp-c-brand-1);
      text-align: right;
      letter-spacing: 0.2rem;
      transition: text-shadow var(--vp-t-color);
    }

    .sub:hover {
      text-shadow: 0 0 0.2rem var(--vp-c-brand-3);
    }

    .main {
      font-size: 3.4rem;
      font-weight: bold;
      line-height: 4.8rem;
      text-align: right;
      letter-spacing: 0.3rem;
      transition: text-shadow var(--vp-t-color);
    }

    .main:hover {
      text-shadow: 0 0 0.5rem var(--vp-c-text-3);
    }
  }

  .countdown {
    align-items: center;
    width: auto;
    width: 21rem;

    .day {
      font-size: 4rem;
      font-weight: bold;
      line-height: 4.6rem;
      text-align: left;
      text-shadow: 0 0 0.3rem var(--vp-c-text-1);
      letter-spacing: 0.6rem;

      .char {
        margin-left: -0.4rem;
        font-size: 1.8rem;
        font-weight: bold;
        line-height: 2.2rem;
        color: var(--vp-c-text-2);
        text-align: left;
        text-shadow: none;
      }
    }

    .time {
      line-height: 2rem;
      color: var(--vp-c-text-3);
      text-align: left;
      letter-spacing: 0.1rem;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .title {
      text-align: center;
    }
  }
}

// @media screen and (max-width: 768px) {
//   .container {
//     flex-direction: row;

//     .title {
//       .sub {
//         font-size: 1.6rem;
//         font-weight: bold;
//         line-height: 1.8rem;
//         color: var(--vp-c-brand-1);
//         text-align: right;
//         letter-spacing: 0.2rem;
//         transition: text-shadow var(--vp-t-color);
//       }
//     }
//   }
// }
</style>
