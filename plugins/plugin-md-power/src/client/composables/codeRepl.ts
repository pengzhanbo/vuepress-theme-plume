import { onMounted, type Ref, ref } from 'vue'
import { http } from '../utils/http.js'
import { sleep } from '../utils/sleep.js'
import { rustExecute } from './rustRepl.js'

const ignoredNodes = ['.diff.remove', '.vp-copy-ignore']
const RE_LANGUAGE = /language-(\w+)/
const api = {
  go: 'https://api.pengzhanbo.cn/repl/golang/run',
  kotlin: 'https://api.pengzhanbo.cn/repl/kotlin/run',
}

type Lang = 'kotlin' | 'go' | 'rust'
type ExecuteFn = (code: string) => Promise<any>
type ExecuteMap = Record<Lang, ExecuteFn>

const langAlias: Record<string, string> = {
  kt: 'kotlin',
  kotlin: 'kotlin',
  go: 'go',
  rust: 'rust',
  rs: 'rust',
}

const supportLang: Lang[] = ['kotlin', 'go', 'rust']

function resolveLang(lang?: string) {
  return lang ? langAlias[lang] || lang : ''
}

export function resolveCode(el: HTMLElement): string {
  const clone = el.cloneNode(true) as HTMLElement
  clone
    .querySelectorAll(ignoredNodes.join(','))
    .forEach(node => node.remove())

  return clone.textContent || ''
}

export function resolveCodeInfo(el: HTMLDivElement) {
  const wrapper = el.querySelector('div[class*=language-]')
  const lang = wrapper?.className.match(RE_LANGUAGE)?.[1]
  const codeEl = wrapper?.querySelector('pre') as HTMLElement
  let code = ''

  if (codeEl)
    code = resolveCode(codeEl)

  return { lang: resolveLang(lang) as Lang, code }
}

export function useCodeRepl(el: Ref<HTMLDivElement | null>) {
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
  }

  function onCleanRun() {
    loaded.value = false
    finished.value = false
    stdout.value = []
    stderr.value = []
    error.value = ''
    firstRun.value = true
    backendVersion.value = ''
  }

  async function onRunCode() {
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

interface GolangRequest {
  code: string
  version?: '' | 'goprev' | 'gotip'
}

interface GolangResponse {
  events?: {
    message: ''
    kind: 'stdout' | 'stderr'
    delay: number
  }[]
  error?: string
  version: string
}

interface KotlinRequest {
  args?: string
  files: {
    name: string
    publicId: string
    text: string
  }[]
}

interface KotlinResponse {
  text: string
  version: string
  errors: {
    [filename: string]: {
      message: string
      severity: 'ERROR' | 'WARNING'
    }[]
  }
}
