import { SRGBColorSpace, VideoTexture } from 'three'

/**
 * Cache video + texture per project. Video dibuat SEKALI lalu dipakai
 * ulang, jadi pindah project tidak perlu mengunduh/men-decode ulang
 * dan tidak memicu Suspense (komputer tidak hilang lalu muncul lagi).
 */
const cache = new Map()

export const getProjectVideo = (src) => {
    if (cache.has(src)) return cache.get(src)

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = src
    video.load()

    const texture = new VideoTexture(video)
    texture.colorSpace = SRGBColorSpace
    texture.flipY = false

    const entry = { video, texture }
    cache.set(src, entry)
    return entry
}

/** Putar hanya video yang sedang tampil, hentikan sisanya (hemat CPU/GPU). */
export const playOnly = (src) => {
    cache.forEach(({ video }, key) => {
        if (key === src) {
            video.play().catch(() => {})
        } else {
            video.pause()
        }
    })
}