/**
 * # Icon
 *
 * ## syntax
 *
 * ::name::
 * ::provide name::
 * ::provide name =size /color extra::
 *
 * ## options
 *
 * - provide: iconify | iconfont | fontawesome
 * - prefix:
 *   - iconify: collect:name                        - prefix = "collect"
 *   - iconfont: iconfont icon-name                 - prefix = "iconfont icon-"
 *   - fontawesome: fa-solid fa-name -> fas:name    - prefix = "fas"
 *
 * - assets: url[]
 *
 * ## iconify
 *
 * - full syntax
 *   ::fluent-mdl2:toggle-filled::
 *   ::fluent-mdl2:toggle-filled =128px /#fff::
 *
 * - prefix: fluent-mdl2
 *   ::toggle-filled::
 *   ::toggle-filled =128px /#fff::
 *
 * ### iconfont
 *
 * ::name::
 * ::name =size /color::
 *
 * ### fontawesome
 *
 * ::fa-solid:name:: -> ::fas:name:: -> ::s:name:: -> ::name::
 * ::fa-brands:name:: -> ::fab:name:: -> ::b:name::
 * ::fa-regular:name:: -> ::far:name:: -> ::r:name::
 *
 * ::name fa-sm::
 *
 * @deprecated :[fluent-mdl2:toggle-filled 128px/#fff]: 此语法已废弃
 */
export * from './icon.js'
export * from './prepareIcon.js'
