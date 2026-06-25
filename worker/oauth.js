/**
 * Cloudflare Worker — GitHub OAuth proxy for Decap CMS
 *
 * Deploy to: oauth.naturalcurlyhair.co.uk
 *
 * Required secrets (set via `wrangler secret put`):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 *
 * GitHub OAuth App settings:
 *   Homepage URL:      https://naturalcurlyhair.co.uk
 *   Callback URL:      https://oauth.naturalcurlyhair.co.uk/callback
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://naturalcurlyhair.co.uk',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    if (url.pathname === '/auth') {
      return handleAuth(url, env)
    }

    if (url.pathname === '/callback') {
      return handleCallback(url, env)
    }

    return new Response('Not found', { status: 404 })
  },
}

// Step 1 — redirect browser to GitHub's authorization page
function handleAuth(url, env) {
  const state = crypto.randomUUID()
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: 'https://oauth.naturalcurlyhair.co.uk/callback',
    scope: 'repo,user',
    state,
  })
  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  )
}

// Step 2 — exchange code for token, post message back to Decap
async function handleCallback(url, env) {
  const code = url.searchParams.get('code')

  if (!code) {
    return errorPage('No code parameter received from GitHub.')
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: 'https://oauth.naturalcurlyhair.co.uk/callback',
    }),
  })

  const data = await tokenRes.json()

  if (data.error || !data.access_token) {
    return errorPage(`GitHub OAuth error: ${data.error_description ?? data.error ?? 'unknown'}`)
  }

  // Decap expects a postMessage with provider + token
  const content = `
    <script>
      (function() {
        function receiveMessage(e) {
          console.log('decap-oauth: received message', e.data)
        }
        window.addEventListener('message', receiveMessage, false)
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
          'https://naturalcurlyhair.co.uk'
        )
      })()
    </script>
  `
  // The JSON inside the postMessage string must be escaped for inline script
  const safeContent = content.replace(
    /authorization:github:success:(.*?)'/,
    (_, payload) =>
      `authorization:github:success:${JSON.stringify(JSON.parse(payload))}'`
  )

  return new Response(buildCallbackHtml(data.access_token), {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  })
}

function buildCallbackHtml(token) {
  // Payload structure Decap CMS expects from the popup window
  const payload = JSON.stringify({ token, provider: 'github' })
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Authenticating…</title></head>
<body>
<p>Authenticating, please wait…</p>
<script>
  (function () {
    var payload = 'authorization:github:success:${payload.replace(/'/g, "\\'")}';
    // Post to the opener (the CMS window) then close
    if (window.opener) {
      window.opener.postMessage(payload, 'https://naturalcurlyhair.co.uk');
    }
    window.close();
  })();
</script>
</body>
</html>`
}

function errorPage(message) {
  return new Response(
    `<!doctype html><html><body><h1>OAuth error</h1><p>${message}</p></body></html>`,
    { status: 400, headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
  )
}
