import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), tushareProxyPlugin(env.TUSHARE_TOKEN)],
    server: {
      proxy: {
        '/api/stooq': {
          target: 'https://stooq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/stooq/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})

function tushareProxyPlugin(token: string | undefined): Plugin {
  return {
    name: 'stock-signal-tushare-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tushare', async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { error: 'method_not_allowed' })
          return
        }

        if (!token) {
          sendJson(response, 503, { error: 'not_configured' })
          return
        }

        try {
          const body = await readJsonBody(request)
          const upstreamResponse = await fetch('https://api.tushare.pro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...body,
              token,
            }),
          })
          const upstreamJson = await upstreamResponse.json()
          sendJson(response, upstreamResponse.ok ? 200 : upstreamResponse.status, upstreamJson)
        } catch {
          sendJson(response, 502, { error: 'provider_error' })
        }
      })
    },
  }
}

function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8')
    })

    request.on('end', () => {
      try {
        resolve(body ? (JSON.parse(body) as Record<string, unknown>) : {})
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Invalid JSON body.'))
      }
    })

    request.on('error', reject)
  })
}

function sendJson(response: ServerResponse, statusCode: number, data: unknown): void {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(data))
}
