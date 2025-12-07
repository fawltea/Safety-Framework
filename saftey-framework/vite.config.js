import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Plugin to rebuild i18n on template/locale changes
function i18nPlugin() {
  return {
    name: 'i18n-rebuild',
    configureServer(server) {
      const rebuildI18n = () => {
        console.log('\n🌐 Rebuilding i18n...')
        execSync('node src/build-i18n.js', { stdio: 'inherit' })
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(['src/template.html', 'locales'])
      server.watcher.on('change', (file) => {
        const normalised = file.replace(/\\/g, '/')
        if (normalised.includes('src/template.html') || normalised.includes('locales/')) {
          rebuildI18n()
        }
      })
    }
  }
}

export default defineConfig({
  base: '/',
  plugins: [i18nPlugin()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        zh: resolve(__dirname, 'zh/index.html'),
        ja: resolve(__dirname, 'ja/index.html'),
      },
    },
  },
})
