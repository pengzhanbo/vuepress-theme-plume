<script setup lang="ts">
import { useRouteLocale, withBase } from '@vuepress/client'
import LayoutContent from '../components/LayoutContent.vue'
import Nav from '../components/Nav/index.vue'
import { useThemeLocaleData } from '../composables'

const root = useRouteLocale()
const themeData = useThemeLocaleData()
</script>

<template>
  <div class="theme-plume">
    <Nav />
    <LayoutContent is-not-found>
      <div class="not-found">
        <p class="code">
          {{ themeData.notFound?.code ?? '404' }}
        </p>
        <h1 class="title">
          {{ themeData.notFound?.title ?? 'PAGE NOT FOUND' }}
        </h1>
        <div class="divider" />
        <blockquote class="quote">
          {{ themeData.notFound?.quote ?? `But if you don't change your direction, and if you keep looking, you may end up where you are heading.` }}
        </blockquote>

        <div class="action">
          <a class="link" :href="withBase(root)" :aria-label="themeData.notFound?.linkLabel ?? 'go to home'">
            {{ themeData.notFound?.linkText ?? 'Take me home' }}
          </a>
        </div>
      </div>
    </LayoutContent>
  </div>
</template>

<style scoped>
.theme-plume {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.not-found {
  padding: 64px 24px 96px;
  text-align: center;
}

@media (min-width: 768px) {
  .not-found {
    padding: 96px 32px 168px;
  }
}

.code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.quote {
  margin: 0 auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.action {
  padding-top: 20px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
  transition:
    border-color 0.25s,
    color 0.25s;
}

.link:hover {
  border-color: var(--vp-c-brand-dark);
  color: var(--vp-c-brand-dark);
}
</style>
