import { type MaybeRef, onMounted, onUnmounted, ref, toValue, watch } from 'vue'

const mimeTypes = {
  'audio/flac': ['flac', 'fla'],
  'audio/mpeg': ['mp3', 'mpga'],
  'audio/mp4': ['mp4', 'm4a'],
  'audio/ogg': ['ogg', 'oga'],
  'audio/aac': ['aac', 'adts'],
  'audio/x-ms-wma': ['wma'],
  'audio/x-aiff': ['aiff', 'aif', 'aifc'],
  'audio/webm': ['webm'],
}

export interface BufferedRange {
  start: number
  end: number
}

export interface AudioPlayerOptions {
  type?: MaybeRef<string>
  autoplay?: boolean
  mutex?: boolean
  onload?: HTMLAudioElement['onload']
  onerror?: HTMLAudioElement['onerror']
  onpause?: HTMLAudioElement['onpause']
  onplay?: HTMLAudioElement['onplay']
  onplaying?: HTMLAudioElement['onplaying']
  onseeked?: HTMLAudioElement['onseeked']
  onvolume?: (volume: number) => void
  onend?: HTMLAudioElement['onended']
  onprogress?: (current: number, total: number) => void
  oncanplay?: HTMLAudioElement['oncanplay']
  oncanplaythrough?: HTMLAudioElement['oncanplaythrough']
  ontimeupdate?: (currentTime: number) => void
  onwaiting?: HTMLAudioElement['onwaiting']
}

const playerList: HTMLAudioElement[] = []

export function useAudioPlayer(source: MaybeRef<string>, options: AudioPlayerOptions = {}) {
  let player: HTMLAudioElement | null = null

  let unknownSupport = false

  const isSupported = ref(false)
  const loaded = ref(false)
  const paused = ref(true)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)

  function initialize() {
    player = document.createElement('audio')
    player.className = 'audio-player'
    player.style.display = 'none'
    player.preload = options.autoplay ? 'auto' : 'none'
    player.autoplay = options.autoplay ?? false
    document.body.appendChild(player)
    playerList.push(player)

    player.onloadedmetadata = () => {
      duration.value = player!.duration
      currentTime.value = player!.currentTime
      volume.value = player!.volume
      loaded.value = true
    }

    player.oncanplay = (...args) => {
      loaded.value = true
      if (unknownSupport)
        isSupported.value = true

      options.oncanplay?.bind(player!)(...args)
    }

    player.onplay = (...args) => {
      paused.value = false
      options.onplay?.bind(player!)(...args)
    }

    player.onpause = (...args) => {
      paused.value = true
      options.onpause?.bind(player!)(...args)
    }

    player.ontimeupdate = () => {
      if (isValidDuration(player!.duration)) {
        const lastBufferTime = getLastBufferedTime()
        if (lastBufferTime <= player!.duration) {
          options.ontimeupdate?.bind(player!)(lastBufferTime)
          currentTime.value = lastBufferTime
          options.onprogress?.bind(player!)(lastBufferTime, player!.duration)
        }
      }
    }

    player.onvolumechange = () => {
      volume.value = player!.volume
      options.onvolume?.bind(player!)(player!.volume)
    }
    player.onended = (...args) => {
      paused.value = true
      options.onend?.bind(player!)(...args)
    }

    player.onplaying = options.onplaying!
    player.onload = options.onload!
    player.onerror = options.onerror!
    player.onseeked = options.onseeked!
    player.oncanplaythrough = options.oncanplaythrough!
    player.onwaiting = options.onwaiting!

    isSupported.value = isSupportType()

    player.src = toValue(source)
    player.load()
  }

  function isSupportType() {
    if (!player)
      return false
    let type = toValue(options.type)
    if (!type) {
      const ext = toValue(source).split('.').pop() || ''
      type = Object.keys(mimeTypes).filter(type => mimeTypes[type].includes(ext))[0]
    }
    if (!type) {
      unknownSupport = true
      return false
    }

    const isSupported = player.canPlayType(type) !== ''
    if (!isSupported) {
      console.warn(`The specified type "${type}" is not supported by the browser.`)
    }
    return isSupported
  }

  function getBufferedRanges(): BufferedRange[] {
    if (!player)
      return []
    const ranges: BufferedRange[] = []
    const seekable = player.buffered || []

    const offset = 0

    for (let i = 0, length = seekable.length; i < length; i++) {
      let start = seekable.start(i)
      let end = seekable.end(i)
      if (!isValidDuration(start))
        start = 0

      if (!isValidDuration(end)) {
        end = 0
        continue
      }

      ranges.push({
        start: start + offset,
        end: end + offset,
      })
    }
    return ranges
  }

  function getLastBufferedTime(): number {
    const bufferedRanges = getBufferedRanges()
    if (!bufferedRanges.length)
      return 0

    const buff = bufferedRanges.find(
      buff =>
        buff.start < player!.currentTime
        && buff.end > player!.currentTime,
    )
    if (buff)
      return buff.end

    const last = bufferedRanges[bufferedRanges.length - 1]
    return last.end
  }

  function isValidDuration(duration: number) {
    if (
      duration
      && !Number.isNaN(duration)
      && duration !== Number.POSITIVE_INFINITY
      && duration !== Number.NEGATIVE_INFINITY
    ) {
      return true
    }

    return false
  }

  function destroy() {
    player?.pause()
    player?.remove()
    playerList.splice(playerList.indexOf(player!), 1)
    player = null
  }

  onMounted(() => {
    initialize()
    watch([source, options.type], () => {
      destroy()
      loaded.value = false
      paused.value = true
      currentTime.value = 0
      duration.value = 0
      initialize()
    })
  })

  onUnmounted(() => destroy())

  return {
    isSupported,
    paused,
    loaded,
    currentTime,
    duration,
    player,
    destroy,
    play: () => {
      if (options.mutex ?? true) {
        for (const p of playerList) {
          if (p !== player)
            p.pause()
        }
      }
      player?.play()
    },
    pause: () => player?.pause(),
    seek(time: number) {
      if (player)
        player.currentTime = time
    },
    setVolume(volume: number) {
      if (player)
        player.volume = Math.min(1, Math.max(0, volume))
    },
  }
}
