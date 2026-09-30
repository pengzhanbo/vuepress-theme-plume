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
  if (isOpen && ws?.readyState === WebSocket.OPEN)
    return Promise.resolve()

  const socket = new WebSocket(wsUrl)
  ws = socket
  uuid = 0

  // 连接生命周期监听器：与握手监听器分离，握手成功后仍然保留。
  // 服务端关闭连接时重置连接状态，避免下次 connect() 复用已关闭的 socket。
  //
  // Lifecycle listener: kept separate from the handshake listeners and remains
  // attached after the handshake, so a server-side close resets the connection
  // state instead of reusing a closed socket.
  socket.addEventListener('close', () => {
    if (ws === socket) {
      ws = null
      isOpen = false
    }
  })

  return new Promise<void>((resolve, reject) => {
    let settled = false

    const timer = setTimeout(() => {
      fail(new Error('Rust REPL websocket connection timed out.'))
    }, CONNECT_TIMEOUT)

    function cleanupHandshake(): void {
      clearTimeout(timer)
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('message', onMessage)
      socket.removeEventListener('error', onError)
      socket.removeEventListener('close', onClose)
    }

    function succeed(): void {
      if (settled)
        return
      settled = true
      cleanupHandshake()
      resolve()
    }

    function fail(error: Error): void {
      if (settled)
        return
      settled = true
      cleanupHandshake()
      if (ws === socket) {
        ws = null
        isOpen = false
      }
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
    socket.addEventListener('message', onMessage)
    socket.addEventListener('error', onError)
    socket.addEventListener('close', onClose)

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
  // 连接不可用时直接失败，交由调用方结束 loading 并展示错误。
  // Fail fast when the connection is unavailable, so the caller can stop loading and show the error.
  if (!ws)
    throw new Error('Rust REPL websocket is not connected.')
  const socket = ws

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

  let stdout = ''
  let stderr = ''

  // 本次执行的 Promise 同时监听执行结束与连接关闭/异常，保证任何情况下都会 settle，
  // 不会因连接中断而永久停留在 loading。
  //
  // The execution promise also observes socket close/error, so it always settles
  // and never leaves the UI loading forever after a broken connection.
  await new Promise<void>((resolve, reject) => {
    let settled = false

    function settle(error?: Error): void {
      if (settled)
        return
      settled = true
      socket.removeEventListener('message', onMessage)
      socket.removeEventListener('close', onSocketClose)
      socket.removeEventListener('error', onSocketError)
      if (error)
        reject(error)
      else
        resolve()
    }

    function onSocketClose(): void {
      settle(new Error('Rust REPL websocket connection closed.'))
    }

    function onSocketError(): void {
      settle(new Error('Rust REPL websocket connection failed.'))
    }

    function onMessage(e: WebSocketEventMap['message']): void {
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
        onEnd?.()
        settle()
      }
    }

    // 连接在发起执行前已关闭时立即结束，避免丢失 close 事件。
    if (socket.readyState !== WebSocket.OPEN) {
      settle(new Error('Rust REPL websocket connection closed.'))
      return
    }

    socket.addEventListener('message', onMessage)
    socket.addEventListener('close', onSocketClose)
    socket.addEventListener('error', onSocketError)
    socket.send(JSON.stringify({ type: payloadType.request, meta, payload }))
  })
}

interface RustExecuteOptions {
  onBegin?: () => void
  onStdout?: (message: string) => void
  onStderr?: (message: string) => void
  onEnd?: () => void
  onError?: (message: string) => void
}
