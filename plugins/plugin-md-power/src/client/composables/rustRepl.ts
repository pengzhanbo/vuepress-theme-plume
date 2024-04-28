/**
 * 相比于 golang 和 kotlin 可以比较简单的实现，
 * rust 需要通过 websocket 建立连接在实现交互，因此，将其进行一些包装，
 * 方便在 codeRepl 中使用
 */
import { tryOnScopeDispose } from '@vueuse/core'

const wsUrl = 'wss://play.rust-lang.org/websocket'

const payloadType = {
  connected: 'websocket/connected',
  request: 'output/execute/wsExecuteRequest',
  execute: {
    begin: 'output/execute/wsExecuteBegin',
    // status: 'output/execute/wsExecuteStatus',
    stderr: 'output/execute/wsExecuteStderr',
    stdout: 'output/execute/wsExecuteStdout',
    end: 'output/execute/wsExecuteEnd',
  },
}

let ws: WebSocket | null = null
let isOpen = false
let uuid = 0

function connect(): Promise<void> {
  if (isOpen)
    return Promise.resolve()

  ws = new WebSocket(wsUrl)
  uuid = 0

  ws.addEventListener('open', () => {
    isOpen = true
    send(
      payloadType.connected,
      { iAcceptThisIsAnUnsupportedApi: true },
      { websocket: true, sequenceNumber: uuid },
    )
  })

  ws.addEventListener('close', () => {
    isOpen = false
    ws = null
  })

  tryOnScopeDispose(() => ws?.close())

  return new Promise((resolve) => {
    function connected(e: WebSocketEventMap['message']) {
      const data = JSON.parse(e.data)
      if (data.type === payloadType.connected) {
        ws?.removeEventListener('message', connected)
        resolve()
      }
    }
    ws?.addEventListener('message', connected)
  })
}

function send(type: string, payload: Record<string, any>, meta: Record<string, any>) {
  const msg = { type, meta, payload }
  ws?.send(JSON.stringify(msg))
}

export async function rustExecute(
  code: string,
  { onEnd, onError, onStderr, onStdout, onBegin }: RustExecuteOptions,
) {
  await connect()
  const meta = { sequenceNumber: uuid++ }
  const payload = {
    backtrace: false,
    channel: 'stable',
    crateType: 'bin',
    edition: '2021',
    mode: 'release',
    tests: false,
    code,
  }
  send(payloadType.request, payload, meta)

  let stdout = ''
  let stderr = ''

  function onMessage(e: WebSocketEventMap['message']) {
    const data = JSON.parse(e.data)
    const { type, payload, meta: _meta = {} } = data
    if (_meta.sequenceNumber !== meta.sequenceNumber)
      return

    if (type === payloadType.execute.begin)
      onBegin?.()

    if (type === payloadType.execute.stdout) {
      stdout += payload
      if (stdout.endsWith('\n')) {
        onStdout?.(stdout)
        stdout = ''
      }
    }

    if (type === payloadType.execute.stderr) {
      stderr += payload
      if (stderr.endsWith('\n')) {
        if (stderr.startsWith('error:')) {
          const index = stderr.indexOf('\n')
          onStderr?.(stderr.slice(0, index))
          onStderr?.(stderr.slice(index + 1))
        }
        else {
          onStderr?.(stderr)
        }
        stderr = ''
      }
    }

    if (type === payloadType.execute.end) {
      if (payload.success === false)
        onError?.(payload.exitDetail)
      ws?.removeEventListener('message', onMessage)
      onEnd?.()
    }
  }
  ws?.addEventListener('message', onMessage)
}

interface RustExecuteOptions {
  onBegin?: () => void
  onStdout?: (message: string) => void
  onStderr?: (message: string) => void
  onEnd?: () => void
  onError?: (message: string) => void
}
