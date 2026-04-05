import { setAccessToken } from './api'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

interface AuthResponse {
  access_token: string
  token_type: string
}

export async function authenticateWithTelegram(initData: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data: initData }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Auth failed: ${response.status} — ${body}`)
  }

  const data: AuthResponse = await response.json()
  setAccessToken(data.access_token)
  return data.access_token
}
