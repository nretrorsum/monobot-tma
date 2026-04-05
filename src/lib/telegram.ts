import { init, retrieveRawInitData } from '@telegram-apps/sdk-react'

export function initTelegramApp() {
  try {
    console.log('[TMA] Initializing SDK...')
    init()
    console.log('[TMA] SDK initialized successfully')
  } catch (e) {
    console.error('[TMA] SDK init failed:', e)
  }
}

export function getInitData(): string | null {
  try {
    const raw = retrieveRawInitData()
    console.log('[TMA] initDataRaw:', raw ? `${raw.slice(0, 80)}...` : 'null')
    return raw ?? null
  } catch (e) {
    console.error('[TMA] Failed to retrieve initData:', e)
    return null
  }
}

export function isDev(): boolean {
  return import.meta.env.DEV
}
