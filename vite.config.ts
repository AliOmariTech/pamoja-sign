import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
const extra = ['./', 'manifest.webmanifest', 'favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png']
export const swPlugin = () => ({
  name: 'pamoja-sw', apply: 'build' as const,
  generateBundle(this: any, _o: unknown, bundle: Record<string, unknown>) {
    const files = [...Object.keys(bundle), ...extra]
    const ver = createHash('sha1').update(files.join('|')).digest('hex').slice(0, 10)
    const src = readFileSync('src/sw.template.js', 'utf8').replace('__FILES__', JSON.stringify(files)).replace('__VER__', JSON.stringify(ver))
    this.emitFile({ type: 'asset', fileName: 'sw.js', source: src })
  },
})
export default defineConfig({
  base: './', plugins: [react(), swPlugin()],
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test-setup.ts'] },
})
