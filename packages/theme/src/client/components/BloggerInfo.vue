<script lang="ts" setup>
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import { isLinkHttp, isLinkMailto } from '@vuepress/shared'
import type { FunctionalComponent, Ref } from 'vue'
import { computed, ref } from 'vue'
import { usePostStat, useThemeLocaleData } from '../composables'
import {
  EmailIcon,
  FacebookIcon,
  FolderIcon,
  GithubIcon,
  LinkedinIcon,
  PostIcon,
  QQIcon,
  TagIcon,
  TwitterIcon,
  WeiBoIcon,
  ZhiHuIcon,
} from './icons'

interface SocialItem {
  url: string
  icon: FunctionalComponent
}
type SocialData = SocialItem[]
type SocialRef = Ref<SocialData>

const themeLocale = useThemeLocaleData()
const avatar = computed(() => themeLocale.value.avatar || {})

const useSocialList = (): SocialRef => {
  const list: SocialRef = ref([])
  const social = themeLocale.value.social || {}
  if (social.QQ) {
    const url = isLinkHttp(social.QQ)
      ? social.QQ
      : `https://wpa.qq.com/msgrd?v=3&uin=${social.QQ}&site=qq&menu=yes`
    list.value.push({ url, icon: QQIcon })
  }
  if (social.email) {
    const url = isLinkMailto(social.email)
      ? social.email
      : `mailto:${social.email}`
    list.value.push({ url, icon: EmailIcon })
  }
  if (social.github) {
    const url = isLinkHttp(social.github)
      ? social.github
      : `https://github.com/${social.github}`
    list.value.push({ url, icon: GithubIcon })
  }
  if (social.linkedin) {
    list.value.push({ url: social.linkedin, icon: LinkedinIcon })
  }
  if (social.weiBo) {
    list.value.push({ url: social.weiBo, icon: WeiBoIcon })
  }
  if (social.zhiHu) {
    list.value.push({ url: social.zhiHu, icon: ZhiHuIcon })
  }
  if (social.facebook) {
    list.value.push({ url: social.facebook, icon: FacebookIcon })
  }
  if (social.twitter) {
    list.value.push({ url: social.twitter, icon: TwitterIcon })
  }
  return list
}
const socialList = useSocialList()

const postStat = usePostStat()
</script>
<template>
  <DropdownTransition>
    <section class="blogger-info">
      <div class="blogger-profile">
        <p v-if="avatar.url" class="avatar-img">
          <img :src="avatar.url" :alt="avatar.name" />
        </p>
        <div>
          <h3>{{ avatar.name }}</h3>
          <p>{{ avatar.description }}</p>
        </div>
      </div>
      <p class="blogger-social">
        <a
          v-for="item in socialList"
          :key="item.url"
          target="_blank"
          :href="item.url"
        >
          <Component :is="item.icon" />
        </a>
      </p>
      <div class="post-stat">
        <div class="post-stat-item">
          <PostIcon />
          <span>{{ postStat.postTotal }}</span>
        </div>
        <div class="post-stat-item">
          <FolderIcon />
          <span>{{ postStat.categoryTotal }}</span>
        </div>
        <div class="post-stat-item">
          <TagIcon />
          <span>{{ postStat.tagTotal }}</span>
        </div>
      </div>
    </section>
  </DropdownTransition>
</template>
<style lang="scss">
.blogger-info {
  padding: 1.25rem;
  // border-radius: var(--p-around);
  // background-color: var(--c-bg-container);
  // box-shadow: var(--shadow);

  .blogger-profile {
    display: flex;
    align-items: center;

    p {
      font-size: 14px;
    }
  }

  .avatar-img {
    width: 30%;
    padding-right: 0.8rem;
    img {
      width: 100%;
    }
  }

  p,
  h3 {
    text-align: left;
    margin: 0;
  }

  h3 {
    padding-bottom: 0.5rem;
    font-size: 18px;
  }

  .blogger-social {
    vertical-align: middle;
    text-align: center;
    a {
      display: inline-block;
      margin: 0.5rem 0.15rem 0;
      vertical-align: middle;
    }

    .icon {
      width: 28px;
      height: 28px;
    }

    .email-icon,
    .github-icon,
    .weiBo-icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .post-stat {
    // display: flex;
    display: none;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid var(--c-border);
    margin-top: 1.75rem;
    padding-top: 1rem;

    .post-stat-item {
      text-align: center;
      color: var(--c-text-quote);
      .icon {
        width: 2rem;
        height: 2rem;
        color: var(--c-text-lightest);
      }
      span {
        display: inline-block;
        width: 100%;
        font-size: 1.25rem;
        font-weight: 500;
      }
    }
  }
}
</style>
