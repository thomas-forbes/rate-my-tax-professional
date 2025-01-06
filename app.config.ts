import { defineConfig } from '@solidjs/start/config'
// @ts-expect-error
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

export default defineConfig({
  // middleware: './src/middleware.ts',
  vite: {
    plugins: [nodePolyfills()],
    ssr: { external: ['drizzle-orm'] },
  },
})
