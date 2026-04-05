import { init, retrieveRawInitData } from '@telegram-apps/sdk-react'

export function initTelegramApp() {
  try {
    init()
  } catch {
    // SDK init fails outside Telegram — expected in dev mode
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
