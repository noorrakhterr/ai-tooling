/**
 * TEMPORARY DIAGNOSTIC — not part of the app's real feature set.
 * Starts a real PKCE authorize round-trip against ai-tools.platform.atko.ai's
 * OIDC server using the public (non-secret) IDDB_OAUTH_CLIENT_ID, to find out
 * whether a user access token from that flow is honored by the REST API's
 * RLS policies. See AuthTestCallbackPage for the other half.
 * Delete both pages + their routes once this question is answered.
 */

const CLIENT_ID = 'iddb_app_E1yjDwIURi-xoMTub_TzZmSK'
const AUTHORIZE_URL = 'https://ai-tools.platform.atko.ai/auth/v1/authorize'
// Must exactly match IDDB_OAUTH_REDIRECT_URI registered on the OAuth client.
const REDIRECT_URI = `${window.location.origin}/auth/callback`

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function randomVerifier(): string {
  const bytes = new Uint8Array(64)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes).slice(0, 64)
}

async function challengeFromVerifier(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return base64UrlEncode(new Uint8Array(digest))
}

export function AuthTestStartPage() {
  async function start() {
    const verifier = randomVerifier()
    const challenge = await challengeFromVerifier(verifier)
    sessionStorage.setItem('pkce_verifier', verifier)

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state: 'diagnostic',
    })
    window.location.href = `${AUTHORIZE_URL}?${params.toString()}`
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-semibold">Auth diagnostic — step 1</h1>
      <button
        onClick={start}
        className="rounded bg-slate-900 px-4 py-2 text-white"
      >
        Start PKCE login against ai-tools.platform.atko.ai
      </button>
    </div>
  )
}
