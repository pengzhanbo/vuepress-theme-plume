<script lang="ts" setup>
import AutoLink from '@theme-plume/AutoLink.vue'
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import type { PropType } from 'vue'
import { computed, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type {
  NavbarItem,
  NavGroup,
  ResolveNavbarItem,
} from '../../shared/index.js'

const props = defineProps({
  item: {
    type: Object as PropType<Exclude<ResolveNavbarItem, NavbarItem>>,
    required: true,
  },
  isHeader: {
    type: Boolean,
    required: true,
  },
})
const { item } = toRefs(props)

const dropdownAriaLabel = computed(
  () => item.value.ariaLabel || item.value.text
)
const open = ref(false)
const route = useRoute()

watch(
  () => route.path,
  () => {
    open.value = false
  }
)

const handleDropdown = (e: MouseEvent): void => {
  const isTriggerByTab = e.detail === 0
  if (isTriggerByTab || props.isHeader) {
    open.value = !open.value
  } else {
    open.value = false
  }
}
const isLastItemOfArray = (item: unknown, arr: unknown[]): boolean =>
  arr[arr.length - 1] === item

const onSubTitleFocusout = (child: any): void => {
  if (
    isLastItemOfArray(child, item.value.children) &&
    child.children &&
    child.children.length === 0
  ) {
    open.value = false
  }
}

const onGrandChildFocusout = (grandchild: unknown, child: any): void => {
  if (
    isLastItemOfArray(grandchild, child.children) &&
    isLastItemOfArray(child, item.value.children)
  ) {
    open.value = false
  }
}
</script>

<template>
  <div
    class="navbar-dropdown-wrapper"
    :class="{ open }"
    @mouseleave="open = false"
  >
    <button
      v-if="isHeader"
      class="navbar-dropdown-title"
      type="button"
      :aria-label="dropdownAriaLabel"
      @click="handleDropdown"
      @mouseenter="open = true"
    >
      <span class="title">{{ item.text }}</span>
      <span class="arrow down"></span>
    </button>

    <button
      v-else
      class="navbar-dropdown-title-mobile"
      type="button"
      :aria-label="dropdownAriaLabel"
      @click="open = !open"
    >
      <span class="title">{{ item.text }}</span>
      <span class="arrow" :class="open ? 'down' : 'right'"></span>
    </button>

    <DropdownTransition>
      <ul v-show="open" class="navbar-dropdown">
        <li
          v-for="child in item.children"
          :key="child.text"
          class="navbar-dropdown-item"
        >
          <template v-if="(child as NavGroup<NavbarItem>).children">
            <h4 class="navbar-dropdown-subtitle">
              <AutoLink
                v-if="(child as NavbarItem).link"
                :item="(child as NavbarItem)"
                @focusout="onSubTitleFocusout(child)"
              />
              <span v-else>{{ child.text }}</span>
            </h4>

            <ul class="navbar-dropdown-subitem-wrapper">
              <li
                v-for="grandchild in (child as unknown as NavGroup<NavbarItem>).children"
                :key="grandchild.link"
                class="navbar-dropdown-subitem"
              >
                <AutoLink
                  :item="grandchild"
                  @focusout="onGrandChildFocusout(grandchild, child)"
                />
              </li>
            </ul>
          </template>

          <template v-else>
            <AutoLink
              :item="(child as NavbarItem)"
              @focusout="
                isLastItemOfArray(child, item.children) && (open = false)
              "
            />
          </template>
        </li>
      </ul>
    </DropdownTransition>
  </div>
</template>

<style lang="scss">
@import '../styles/_variables';
@import '../styles/_mixins';

.navbar-dropdown-wrapper {
  cursor: pointer;

  .navbar-dropdown-title {
    display: block;
    font-size: 1rem;
    font-family: inherit;
    cursor: inherit;
    padding: inherit;
    line-height: 1.4rem;
    background: transparent;
    border: none;
    font-weight: 500;
    color: var(--c-text);

    &:hover {
      border-color: transparent;
    }

    .arrow {
      vertical-align: middle;
      margin-top: -1px;
      margin-left: 0.4rem;
    }
  }

  .navbar-dropdown-title-mobile {
    @extend .navbar-dropdown-title;
    display: none;
    font-weight: 600;
    font-size: inherit;

    &:hover {
      color: var(--c-text-accent);
    }
  }

  .navbar-dropdown {
    list-style: none;
    .navbar-dropdown-item {
      color: inherit;
      line-height: 1.7rem;
      cursor: default;

      .navbar-dropdown-subtitle {
        margin: 0.45rem 0 0;
        border-top: 1px solid var(--c-border);
        padding: 1rem 0 0.45rem 0;
        font-size: 1rem;
        color: var(--c-text-light);

        & > span {
          padding: 0 1.5rem;
        }

        & > a {
          font-weight: inherit;

          &.router-link-active {
            &::after {
              display: none;
            }
          }
        }
      }

      .navbar-dropdown-subitem-wrapper {
        padding: 0;
        list-style: none;

        .navbar-dropdown-subitem {
          font-size: 1em;
        }
      }

      a {
        display: block;
        line-height: 1.7rem;
        position: relative;
        border-bottom: none;
        font-weight: 400;
        margin-bottom: 0;
        padding: 0 1.5rem 0 1.25rem;

        &:hover {
          color: var(--c-text-accent);
        }

        &.router-link-active {
          color: var(--c-text-accent);

          &::after {
            content: '';
            width: 0;
            height: 0;
            border-left: 5px solid var(--c-text-accent);
            border-top: 3px solid transparent;
            border-bottom: 3px solid transparent;
            position: absolute;
            top: calc(50% - 2px);
            left: 9px;
          }
        }
      }

      &:first-child .navbar-dropdown-subtitle {
        margin-top: 0;
        padding-top: 0;
        border-top: 0;
      }
    }
  }
}

@media (max-width: $MQMobile) {
  .navbar-dropdown-wrapper {
    &.open .navbar-dropdown-title {
      margin-bottom: 0.5rem;
    }

    .navbar-dropdown-title {
      display: none;
    }

    .navbar-dropdown-title-mobile {
      display: block;
    }

    .navbar-dropdown {
      @include dropdown_wrapper;

      .navbar-dropdown-item {
        .navbar-dropdown-subtitle {
          padding-top: 0;
          margin-top: 0;
          border-top: 0;
          padding-bottom: 0;
        }

        .navbar-dropdown-subtitle,
        & > a {
          font-size: 1rem;
          line-height: 2rem;
        }

        .navbar-dropdown-subitem {
          font-size: 1rem;
          padding-left: 1rem;
        }
      }
    }
  }
}

@media (min-width: ($MQMobile + 1)) {
  .navbar-dropdown-wrapper {
    height: 1.8rem;

    &.open .navbar-dropdown {
      opacity: 1;
      transform: none;
    }

    .navbar-dropdown {
      opacity: 0;
      transform: translateY(-0.5rem);
      transition: opacity 0.3s ease, transform 0.3s ease;
      height: auto !important;
      max-height: calc(100vh - 2.7rem);
      overflow-y: auto;
      position: absolute;
      top: 100%;
      right: 0;
      box-sizing: border-box;
      background-color: var(--c-bg-container);
      padding: 1.5rem 0.75rem;
      border: 1px solid var(--c-border);
      border-bottom-color: var(--c-border-dark);
      text-align: left;
      border-radius: 0.25rem;
      white-space: nowrap;
      margin: 0;
      box-shadow: var(--shadow);
    }
  }
}
</style>
