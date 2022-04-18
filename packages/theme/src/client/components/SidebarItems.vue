<script lang="ts" setup>
import AutoLink from '@theme-plume/AutoLink.vue'
import { computed, ref, watchEffect } from 'vue'
import type { PropType } from 'vue'
import type { SidebarItem, SidebarOptions } from '../../shared'
import { useThemeLocaleData } from '../composables'
import { hasOwn } from '../utils'
import { ArrowRightIcon } from './icons'

type SidebarListComputed = SidebarItem & { open: boolean }

const props = defineProps({
  sidebarList: {
    type: Array as PropType<SidebarOptions>,
    required: true,
  },
  deep: {
    type: Number,
    required: false,
    default: 1,
  },
})
const themeLocale = useThemeLocaleData()

const collapsible = computed(() => {
  if (
    !themeLocale.value.notes ||
    !hasOwn(themeLocale.value.notes, 'collapsible')
  ) {
    return true
  } else {
    return themeLocale.value.notes.collapsible
  }
})

const sidebarList = ref<SidebarListComputed[]>([])
watchEffect(() => {
  sidebarList.value = props.sidebarList.map((sidebar) => {
    return { ...sidebar, open: !!collapsible.value }
  })
})
const sidebarClick = (sidebar: SidebarListComputed): void => {
  if (props.deep === 1) {
    sidebar.open = !sidebar.open
  }
}
</script>
<template>
  <ul class="sidebar-items">
    <li
      v-for="sidebar in sidebarList"
      :key="sidebar.text"
      :class="{ line: deep === 1 }"
    >
      <p @click.self="sidebarClick(sidebar)">
        <AutoLink
          v-if="sidebar.link"
          :item="{ text: sidebar.text, link: sidebar.link }"
        />
        <span v-else @click.self="sidebarClick(sidebar)">
          {{ sidebar.text }}
        </span>
        <ArrowRightIcon
          v-if="deep === 1 && sidebar.children.length"
          :class="{ open: sidebar.open }"
          @click.self="sidebarClick(sidebar)"
        />
      </p>
      <SidebarItems
        v-show="sidebar.open"
        :sidebar-list="sidebar.children"
        :deep="deep + 1"
      />
    </li>
  </ul>
</template>
<style lang="scss">
.plume-theme-sidebar-wrapper {
  .sidebar-items {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      a {
        color: var(--c-text);
        margin: 0.25rem 0;
        font-weight: bold;
        flex: 1;

        &:hover {
          color: var(--c-text-accent);
        }

        &.router-link-active {
          color: var(--c-text-accent);
        }
      }
      span {
        font-weight: 600;
        margin: 0.25rem 0;
        flex: 1;
      }

      p {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        height: 40px;

        .arrow-right-icon {
          width: 14px;
          height: 14px;
          margin-right: 0.25rem;
          transform: rotate(0);
          transition: transform var(--t-color);

          &.open {
            transform: rotate(90deg);
          }
        }
      }

      &.line {
        border-bottom: solid 1px var(--c-border);

        &:last-child {
          border-bottom: none;
        }
      }
    }
    .sidebar-items {
      font-size: 16px;
      padding-left: 1.25rem;

      li a {
        font-weight: normal;
      }
    }
  }
}
</style>
