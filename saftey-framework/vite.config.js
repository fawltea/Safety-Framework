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
    handleHotUpdate({ file }) {
      if (file.includes('/src/template.html') || file.includes('/locales/')) {
        console.log('\n🌐 Rebuilding i18n...')
        execSync('node src/build-i18n.js', { stdio: 'inherit' })
      }
    }
  }
}

export default defineConfig({
  base: '/',
  plugins: [i18nPlugin()],
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
