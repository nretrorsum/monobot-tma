import { init, retrieveRawInitData } from '@telegram-apps/sdk-react'

export function initTelegramApp() {
  try {
    init()
  } catch {
    if (import.meta.env.DEV) {
      console.warn('[TMA] SDK init failed — running outside Telegram (dev mode)')
    }
  }
}

export function getInitData(): string | null {
  try {
    const raw = retrieveRawInitData()
    return raw ?? null
  } catch {
    return null
  }
}

export function isDev(): boolean {
  return import.meta.env.DEV
}
