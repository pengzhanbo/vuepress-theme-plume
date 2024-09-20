import type { MaybeRef, MaybeRefOrGetter, Ref } from 'vue'
import type { RouteParamValueRaw, Router } from 'vue-router'
import { tryOnScopeDispose } from '@vueuse/core'
import { customRef, nextTick, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vuepress/client'

export type RouteQueryValueRaw = RouteParamValueRaw | string[]

export interface ReactiveRouteOptions {
  /**
   * Mode to update the router query, ref is also acceptable
   *
   * @default 'replace'
   */
  mode?: MaybeRef<'replace' | 'push'>

  /**
   * Route instance, use `useRoute()` if not given
   */
  route?: ReturnType<typeof useRoute>

  /**
   * Router instance, use `useRouter()` if not given
   */
  router?: ReturnType<typeof useRouter>
}

export interface ReactiveRouteOptionsWithTransform<V, R> extends ReactiveRouteOptions {
  /**
   * Function to transform data before return
   */
  transform?: (val: V) => R
}

const _queue = new WeakMap<Router, Map<string, any>>()

export function useRouteQuery(
  name: string
): Ref<null | string | string[]>

export function useRouteQuery<
  T extends RouteQueryValueRaw = RouteQueryValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options?: ReactiveRouteOptionsWithTransform<T, K>
): Ref<K>

export function useRouteQuery<
  T extends RouteQueryValueRaw = RouteQueryValueRaw,
  K = T,
>(
  name: string,
  defaultValue?: MaybeRefOrGetter<T>,
  options: ReactiveRouteOptionsWithTransform<T, K> = {},
): Ref<K> {
  const {
    mode = 'replace',
    route = useRoute(),
    router = useRouter(),
    transform = value => value as any as K,
  } = options

  if (!_queue.has(router))
    _queue.set(router, new Map())

  const _queriesQueue = _queue.get(router)!

  let query = route.query[name] as any

  tryOnScopeDispose(() => {
    query = undefined
  })

  let _trigger: () => void

  const proxy = customRef<any>((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()

        return transform(query !== undefined ? query : toValue(defaultValue))
      },
      set(v) {
        if (query === v)
          return

        query = v
        _queriesQueue.set(name, v)

        trigger()

        nextTick(() => {
          if (_queriesQueue.size === 0)
            return

          const newQueries = Object.fromEntries(_queriesQueue.entries())
          _queriesQueue.clear()

          const { query, hash, path } = route
          router[toValue(mode)]({
            path,
            query: { ...query, ...newQueries },
            hash,
          })
        })
      },
    }
  })

  watch(
    () => route.query[name],
    (v) => {
      query = v

      _trigger()
    },
    { flush: 'sync' },
  )

  return proxy as any as Ref<K>
}
