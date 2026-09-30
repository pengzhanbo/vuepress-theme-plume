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

/**
 * Connection timeout in milliseconds.
 *
 * 连接超时时间（毫秒）。
 */
const CONNECT_TIMEOUT = 10_000

/**
 * Establish the websocket connection.
 *
 * The returned promise rejects on `error`/`close` events or after a timeout,
 * so a failed connection can never leave the caller awaiting forever.
 *
 * 建立 websocket 连接。
 *
 * 连接失败、被关闭或超时都会 reject，避免 Promise 永不 settle 导致调用方永久阻塞。
 *
 * @returns Promise resolved once the handshake completes / 握手完成后 resolve 的 Promise
 */
function connect(): Promise<void> {
  if (isOpen)
    return Promise.resolve()

  const socket = new WebSocket(wsUrl)
  ws = socket
  uuid = 0

  return new Promise<void>((resolve, reject) => {
    let settled = false

    const timer = setTimeout(() => {
      fail(new Error('Rust REPL websocket connection timed out.'))
    }, CONNECT_TIMEOUT)

    function cleanup(): void {
      clearTimeout(timer)
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('close', onClose)
      socket.removeEventListener('error', onError)
      socket.removeEventListener('message', onMessage)
    }

    function succeed(): void {
      if (settled)
        return
      settled = true
      cleanup()
      resolve()
    }

    function fail(error: Error): void {
      if (settled)
        return
      settled = true
      cleanup()
      isOpen = false
      if (ws === socket)
        ws = null
      socket.close()
      reject(error)
    }

    function onOpen(): void {
      isOpen = true
      send(
        payloadType.connected,
        { iAcceptThisIsAnUnsupportedApi: true },
        { websocket: true, sequenceNumber: uuid },
      )
    }

    function onClose(): void {
      fail(new Error('Rust REPL websocket connection closed.'))
    }

    function onError(): void {
      fail(new Error('Rust REPL websocket connection failed.'))
    }

    function onMessage(e: WebSocketEventMap['message']): void {
      try {
        const data = JSON.parse(e.data)
        if (data.type === payloadType.connected)
          succeed()
      }
      catch {
        // 忽略无法解析的消息 / ignore malformed messages
      }
    }

    socket.addEventListener('open', onOpen)
    socket.addEventListener('close', onClose)
    socket.addEventListener('error', onError)
    socket.addEventListener('message', onMessage)

    tryOnScopeDispose(() => socket.close())
  })
}

function send(type: string, payload: Record<string, any>, meta: Record<string, any>) {
  const msg = { type, meta, payload }
  ws?.send(JSON.stringify(msg))
}

export async function rustExecute(
  code: string,
  { onEnd, onError, onStderr, onStdout, onBegin }: RustExecuteOptions,
): Promise<void> {
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
    let data: any
    try {
      data = JSON.parse(e.data)
    }
    catch {
      // 忽略无法解析的消息 / ignore malformed messages
      return
    }
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
