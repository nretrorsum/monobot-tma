import { setAccessToken } from './api'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

interface AuthResponse {
  access_token: string
  token_type: string
}

export async function authenticateWithTelegram(initData: string): Promise<string> {
  const url = `${API_URL}/auth/telegram`
  console.log('[Auth] POST', url)
  console.log('[Auth] initData length:', initData.length)

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ init_data: initData }),
    })
  } catch (e) {
    console.error('[Auth] Network error:', e)
    throw new Error(`Network error: ${e instanceof Error ? e.message : String(e)}`)
  }

  console.log('[Auth] Response status:', response.status)

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    console.error('[Auth] Error body:', body)
    throw new Error(`Auth failed: ${response.status} — ${body}`)
  }

  const data: AuthResponse = await response.json()
  console.log('[Auth] Token received, length:', data.access_token?.length)
  setAccessToken(data.access_token)
  return data.access_token
}
