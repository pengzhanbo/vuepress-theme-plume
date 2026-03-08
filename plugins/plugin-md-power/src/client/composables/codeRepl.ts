import type { PyodideInterface } from 'pyodide'
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { http } from '../utils/http.js'
import { sleep } from '../utils/sleep.js'
import { rustExecute } from './rustRepl.js'

/**
 * CSS selectors for nodes to ignore when extracting code.
 *
 * 提取代码时要忽略的节点的 CSS 选择器。
 */
const ignoredNodes = ['.diff.remove', '.vp-copy-ignore']

/**
 * Regular expression for matching language class.
 *
 * 匹配语言类的正则表达式。
 */
const RE_LANGUAGE = /language-(\w+)/

/**
 * API endpoints for code execution backends.
 *
 * 代码执行后端的 API 端点。
 */
const api = {
  go: 'https://api.pengzhanbo.cn/repl/golang/run',
  kotlin: 'https://api.pengzhanbo.cn/repl/kotlin/run',
}

/**
 * Pyodide instance for Python execution.
 *
 * 用于 Python 执行的 Pyodide 实例。
 */
let pyodide: PyodideInterface | null = null

/**
 * Supported languages for code execution.
 *
 * 支持代码执行的语言。
 */
type Lang = 'kotlin' | 'go' | 'rust' | 'python'

/**
 * Function type for code execution.
 *
 * 代码执行的函数类型。
 */
type ExecuteFn = (code: string) => Promise<any>

/**
 * Map of language to execution function.
 *
 * 语言到执行函数的映射。
 */
type ExecuteMap = Record<Lang, ExecuteFn>

/**
 * Language alias mapping.
 *
 * 语言别名映射。
 */
const langAlias: Record<string, string> = {
  kt: 'kotlin',
  kotlin: 'kotlin',
  go: 'go',
  rust: 'rust',
  rs: 'rust',
  py: 'python',
  python: 'python',
}

/**
 * List of supported languages.
 *
 * 支持的语言列表。
 */
const supportLang: Lang[] = ['kotlin', 'go', 'rust', 'python']

/**
 * Resolve language name from alias.
 *
 * 从别名解析语言名称。
 *
 * @param lang - Language or alias / 语言或别名
 * @returns Resolved language name / 解析后的语言名称
 */
function resolveLang(lang?: string) {
  return lang ? langAlias[lang] || lang : ''
}

/**
 * Resolve code content from HTML element, ignoring specified nodes.
 *
 * 从 HTML 元素解析代码内容，忽略指定的节点。
 *
 * @param el - HTML element / HTML 元素
 * @returns Code content / 代码内容
 */
export function resolveCode(el: HTMLElement): string {
  const clone = el.cloneNode(true) as HTMLElement
  clone
    .querySelectorAll(ignoredNodes.join(','))
    .forEach(node => node.remove())

  return clone.textContent || ''
}

/**
 * Resolve code information from HTML element.
 *
 * 从 HTML 元素解析代码信息。
 *
 * @param el - HTML element / HTML 元素
 * @returns Object with language and code / 包含语言和代码的对象
 */
export function resolveCodeInfo(el: HTMLDivElement): {
  lang: Lang
  code: string
} {
  const wrapper = el.querySelector('div[class*=language-]')
  const lang = wrapper?.className.match(RE_LANGUAGE)?.[1]
  const codeEl = wrapper?.querySelector('pre') as HTMLElement
  let code = ''

  if (codeEl)
    code = resolveCode(codeEl)

  return { lang: resolveLang(lang) as Lang, code }
}

/**
 * Result interface for useCodeRepl composable.
 *
 * useCodeRepl 组合式函数的结果接口。
 */
interface UseCodeReplResult {
  /** Current language / 当前语言 */
  lang: Ref<Lang | undefined>
  /** Whether the code is loaded / 代码是否已加载 */
  loaded: Ref<boolean>
  /** Whether this is the first run / 是否为首次运行 */
  firstRun: Ref<boolean>
  /** Whether execution is finished / 执行是否完成 */
  finished: Ref<boolean>
  /** Standard output lines / 标准输出行 */
  stdout: Ref<string[]>
  /** Standard error lines / 标准错误行 */
  stderr: Ref<string[]>
  /** Error message / 错误信息 */
  error: Ref<string>
  /** Backend version / 后端版本 */
  backendVersion: Ref<string>
  /** Clean run state / 清理运行状态 */
  onCleanRun: () => void
  /** Run code execution / 运行代码执行 */
  onRunCode: () => Promise<void>
}

/**
 * Composable for code REPL functionality.
 *
 * 代码 REPL 功能的组合式函数。
 *
 * This composable provides functionality to execute code in various languages
 * (Kotlin, Go, Rust, Python) and manage the execution state.
 *
 * 该组合式函数提供在各种语言（Kotlin、Go、Rust、Python）中执行代码和管理执行状态的功能。
 *
 * @param el - Reference to the code element / 代码元素的引用
 * @returns REPL state and methods / REPL 状态和方法
 *
 * @example
 * ```vue
 * <script setup>
 * const codeEl = ref(null)
 * const { onRunCode, stdout, stderr, loaded } = useCodeRepl(codeEl)
 * </script>
 * ```
 */
export function useCodeRepl(el: Ref<HTMLDivElement | null>): UseCodeReplResult {
  const lang = ref<Lang>()
  const loaded = ref(true)
  const firstRun = ref(true)
  const finished = ref(true)

  const stdout = ref<string[]>([]) // like print
  const stderr = ref<string[]>([]) // like print error
  const error = ref('') // execute error
  const backendVersion = ref('')

  onMounted(() => {
    if (el.value) {
      const info = resolveCodeInfo(el.value)
      lang.value = info.lang
    }
  })

  const executeMap: ExecuteMap = {
    kotlin: executeKotlin,
    go: executeGolang,
    rust: executeRust,
    python: executePython,
  }

  function onCleanRun(): void {
    loaded.value = false
    finished.value = false
    stdout.value = []
    stderr.value = []
    error.value = ''
    firstRun.value = true
    backendVersion.value = ''
  }

  async function onRunCode(): Promise<void> {
    if (!el.value || !loaded.value)
      return
    const info = resolveCodeInfo(el.value)
    lang.value = info.lang

    if (!lang.value || !info.code || !supportLang.includes(lang.value))
      return

    if (firstRun.value)
      firstRun.value = false

    loaded.value = false
    finished.value = false
    stdout.value = []
    stderr.value = []
    error.value = ''

    await executeMap[lang.value]?.(info.code)
  }

  async function executeGolang(code: string) {
    const res = await http.post<GolangRequest, GolangResponse>(api.go, { code })
    backendVersion.value = `v${res.version}`
    loaded.value = true
    if (res.error) {
      error.value = res.error
      finished.value = true
      return
    }
    const events = res.events || []
    for (const event of events) {
      if (event.kind === 'stdout') {
        if (event.delay)
          await sleep(event.delay / 1000000)

        stdout.value.push(event.message)
      }
      else if (event.kind === 'stderr') {
        stderr.value.push(event.message)
      }
    }
    finished.value = true
  }

  async function executeKotlin(code: string) {
    const filename = 'File.kt'
    const res = await http.post<KotlinRequest, KotlinResponse>(api.kotlin, {
      args: '',
      files: [{ name: filename, publicId: '', text: code }],
    })
    backendVersion.value = `v${res.version}`
    loaded.value = true
    if (res.errors) {
      const errors = Array.isArray(res.errors[filename]) ? res.errors[filename] : [res.errors[filename]]
      if (errors.length) {
        errors.forEach(
          ({ message, severity }) => severity === 'ERROR' && stderr.value.push(message),
        )
      }
    }
    stdout.value.push(res.text)
    finished.value = true
  }

  async function executeRust(code: string) {
    await rustExecute(code, {
      onBegin: () => {
        loaded.value = true
        finished.value = false
        stdout.value = []
        stderr.value = []
        error.value = ''
        backendVersion.value = 'release'
      },
      onError(message) {
        error.value = message
      },
      onStdout(message) {
        stdout.value.push(message)
      },
      onStderr(message) {
        stderr.value.push(message)
      },
      onEnd: () => {
        finished.value = true
      },
    })
  }

  async function executePython(code: string) {
    loaded.value = false
    finished.value = false
    if (pyodide === null) {
      const { loadPyodide, version } = await import(/* webpackChunkName: "pyodide" */ 'pyodide')
      pyodide = await loadPyodide({ indexURL: `https://cdn.jsdelivr.net/pyodide/v${version}/full/` })
    }
    pyodide.setStdout({ batched: msg => stdout.value.push(msg) })
    try {
      stdout.value.push(pyodide.runPython(code))
    }
    catch (e: unknown) {
      stderr.value.push(String(e as Error))
    }
    loaded.value = true
    finished.value = true
  }

  return {
    onRunCode,
    onCleanRun,
    lang,
    backendVersion,
    firstRun,
    stderr,
    stdout,
    loaded,
    finished,
    error,
  }
}

/**
 * Request interface for Golang execution API.
 *
 * Golang 执行 API 的请求接口。
 */
interface GolangRequest {
  /** Code to execute / 要执行的代码 */
  code: string
  /** Go version / Go 版本 */
  version?: '' | 'goprev' | 'gotip'
}

/**
 * Response interface for Golang execution API.
 *
 * Golang 执行 API 的响应接口。
 */
interface GolangResponse {
  /** Execution events / 执行事件 */
  events?: {
    /** Event message / 事件消息 */
    message: ''
    /** Event kind / 事件类型 */
    kind: 'stdout' | 'stderr'
    /** Event delay / 事件延迟 */
    delay: number
  }[]
  /** Error message / 错误信息 */
  error?: string
  /** Go version / Go 版本 */
  version: string
}

/**
 * Request interface for Kotlin execution API.
 *
 * Kotlin 执行 API 的请求接口。
 */
interface KotlinRequest {
  /** Command line arguments / 命令行参数 */
  args?: string
  /** Files to compile / 要编译的文件 */
  files: {
    /** File name / 文件名 */
    name: string
    /** Public ID / 公共 ID */
    publicId: string
    /** File content / 文件内容 */
    text: string
  }[]
}

/**
 * Response interface for Kotlin execution API.
 *
 * Kotlin 执行 API 的响应接口。
 */
interface KotlinResponse {
  /** Execution output / 执行输出 */
  text: string
  /** Kotlin version / Kotlin 版本 */
  version: string
  /** Compilation errors / 编译错误 */
  errors: {
    [filename: string]: {
      /** Error message / 错误信息 */
      message: string
      /** Error severity / 错误严重程度 */
      severity: 'ERROR' | 'WARNING'
    }[]
  }
}
