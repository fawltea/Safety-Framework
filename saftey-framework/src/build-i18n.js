import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Language configuration
const languages = ['en', 'zh', 'ja']

// Read template
const templatePath = path.join(rootDir, 'src', 'template.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// Process each language
for (const lang of languages) {
  // Read locale file
  const localePath = path.join(rootDir, 'locales', `${lang}.json`)
  const locale = JSON.parse(fs.readFileSync(localePath, 'utf-8'))

  // Replace all placeholders
  let html = template
  for (const [key, value] of Object.entries(locale)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    html = html.replace(regex, value)
  }

  // Handle selected state for language dropdown
  for (const l of languages) {
    const selectedRegex = new RegExp(`\\{\\{#${l}_selected\\}\\}selected\\{\\{/${l}_selected\\}\\}`, 'g')
    html = html.replace(selectedRegex, l === lang ? 'selected' : '')
  }

  // Create output directory
  const outputDir = path.join(rootDir, lang)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write output file
  const outputPath = path.join(outputDir, 'index.html')
  fs.writeFileSync(outputPath, html, 'utf-8')

  console.log(`Generated: ${lang}/index.html`)
}

console.log('i18n build complete!')
