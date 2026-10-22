/**
 * TEMPORARY DIAGNOSTIC — see AuthTestStartPage. Completes the PKCE exchange
 * and then tries the real question: does a user access token from this flow
 * get past RLS on ai_tools, or does it fail the same way the anon key did.
 */
import { useEffect, useState } from 'react'

const CLIENT_ID = 'iddb_app_E1yjDwIURi-xoMTub_TzZmSK'
const TOKEN_URL = 'https://ai-tools.platform.atko.ai/auth/v1/token'
const REST_URL = 'https://api.platform.atko.ai/ai-tools/rest/v1/ai_tools?select=id&limit=1'

export function AuthTestCallbackPage() {
  const [log, setLog] = useState<string[]>(['starting...'])

  useEffect(() => {
    void run()
  }, [])

  function append(line: string) {
    setLog((prev) => [...prev, line])
  }

  async function run() {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const verifier = sessionStorage.getItem('pkce_verifier')

    if (error) {
      append(`authorize returned error: ${error}`)
      return
    }
    if (!code) {
      append('no ?code in callback URL — nothing to exchange')
      return
    }
    if (!verifier) {
      append('no pkce_verifier in sessionStorage — cannot complete exchange')
      return
    }
    append(`got code, exchanging at ${TOKEN_URL}`)

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${window.location.origin}/auth/callback`,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    })

    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const tokenJson = await tokenRes.json().catch(() => null)

    if (!tokenRes.ok) {
      append(`token exchange FAILED (${tokenRes.status}): ${JSON.stringify(tokenJson)}`)
      return
    }
    append(`token exchange OK — got access_token (len ${tokenJson?.access_token?.length ?? 0})`)

    const accessToken = tokenJson.access_token as string
    append(`now calling REST API with user token as Bearer: ${REST_URL}`)

    const restRes = await fetch(REST_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const restText = await restRes.text()
    append(`REST API responded ${restRes.status}: ${restText}`)
  }

  return (
    <div className="p-6 font-mono text-sm whitespace-pre-wrap">
      <h1 className="mb-4 text-lg font-semibold">Auth diagnostic — step 2 (callback)</h1>
      {log.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  )
}
