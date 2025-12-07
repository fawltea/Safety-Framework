import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Language configuration - English outputs to root, others to their own folders
const languages = [
  { code: 'en', outputPath: '' },      // English at root
  { code: 'zh', outputPath: 'zh' },    // Chinese at /zh/
  { code: 'ja', outputPath: 'ja' }     // Japanese at /ja/
]

// Level color configuration
const levelColors = [
  { bg: 'red', light: 'red-100', dark: 'red-900/50', text: 'red-600', darkText: 'red-400', ring: 'red-300', darkRing: 'red-700' },
  { bg: 'orange', light: 'orange-100', dark: 'orange-900/50', text: 'orange-600', darkText: 'orange-400', ring: 'orange-300', darkRing: 'orange-700' },
  { bg: 'amber', light: 'amber-100', dark: 'amber-900/50', text: 'amber-600', darkText: 'amber-400', ring: 'amber-300', darkRing: 'amber-700' },
  { bg: 'emerald', light: 'emerald-100', dark: 'emerald-900/50', text: 'emerald-600', darkText: 'emerald-400', ring: 'emerald-300', darkRing: 'emerald-700' },
  { bg: 'teal', light: 'teal-100', dark: 'teal-900/50', text: 'teal-600', darkText: 'teal-400', ring: 'teal-300', darkRing: 'teal-700' },
  { bg: 'sky', light: 'sky-100', dark: 'sky-900/50', text: 'sky-600', darkText: 'sky-400', ring: 'sky-300', darkRing: 'sky-700' }
]

// Generate a level card HTML
function generateLevelCard(level, index, examplesLabel) {
  const color = levelColors[index]
  const examplesHtml = level.examples
    .map(example => `                  <li class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex"><span class="text-zinc-400 dark:text-zinc-500 mr-2 shrink-0">–</span><span>${example}</span></li>`)
    .join('\n')

  return `        <!-- Level ${index} -->
        <article id="level-${index}" class="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 p-5 scroll-mt-4">
          <div class="flex items-start gap-4">
            <a href="#level-${index}" class="flex-shrink-0 w-10 h-10 rounded-full bg-${color.light} dark:bg-${color.dark} flex items-center justify-center hover:ring-2 hover:ring-${color.ring} dark:hover:ring-${color.darkRing} transition-shadow">
              <span class="text-lg font-bold text-${color.text} dark:text-${color.darkText}">${index}</span>
            </a>
            <div class="flex-1 min-w-0">
              <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">${level.name}</h2>
              <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">${level.description}</p>
              <details class="mt-3">
                <summary class="text-sm text-zinc-400 dark:text-zinc-500 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 select-none">${examplesLabel}</summary>
                <ul class="mt-3 ml-4 space-y-3 list-none">
${examplesHtml}
                </ul>
              </details>
            </div>
          </div>
        </article>`
}

// Generate a table row HTML
function generateTableRow(level, index) {
  const color = levelColors[index]
  const rowBg = index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800/50'

  return `            <tr class="${rowBg}">
              <td class="px-3 py-2"><span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-${color.light} dark:bg-${color.dark} text-${color.text} dark:text-${color.darkText} text-xs font-bold">${index}</span></td>
              <td class="px-3 py-2 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">${level.name}</td>
              <td class="px-3 py-2 text-zinc-600 dark:text-zinc-400">${level.table_description}</td>
            </tr>`
}

// Read template
const templatePath = path.join(rootDir, 'src', 'template.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// Process each language
for (const { code: lang, outputPath } of languages) {
  // Read locale file
  const localePath = path.join(rootDir, 'locales', `${lang}.json`)
  const locale = JSON.parse(fs.readFileSync(localePath, 'utf-8'))

  // Generate level cards HTML
  const levelsHtml = locale.levels
    .map((level, index) => generateLevelCard(level, index, locale.examples_label))
    .join('\n\n')

  // Generate table rows HTML
  const tableRowsHtml = locale.levels
    .map((level, index) => generateTableRow(level, index))
    .join('\n')

  // Replace all placeholders
  let html = template

  // Replace levels placeholder with generated HTML
  html = html.replace('{{levels_html}}', levelsHtml)
  html = html.replace('{{table_rows_html}}', tableRowsHtml)

  // Replace canonical URL (English at root, others at /lang/)
  const canonicalUrl = outputPath === ''
    ? 'https://safety-framework.fawltea.net/'
    : `https://safety-framework.fawltea.net/${outputPath}/`
  html = html.replace(/\{\{canonical_url\}\}/g, canonicalUrl)

  // Replace simple placeholders
  for (const [key, value] of Object.entries(locale)) {
    if (typeof value === 'string') {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      html = html.replace(regex, value)
    }
  }

  // Handle selected state for language dropdown
  for (const { code: l } of languages) {
    const selectedRegex = new RegExp(`\\{\\{#${l}_selected\\}\\}selected\\{\\{/${l}_selected\\}\\}`, 'g')
    html = html.replace(selectedRegex, l === lang ? 'selected' : '')
  }

  // Determine output location
  let outputFile
  if (outputPath === '') {
    // English goes to root index.html
    outputFile = path.join(rootDir, 'index.html')
  } else {
    // Other languages go to their own folders
    const outputDir = path.join(rootDir, outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    outputFile = path.join(outputDir, 'index.html')
  }

  // Write output file
  fs.writeFileSync(outputFile, html, 'utf-8')

  const displayPath = outputPath === '' ? 'index.html (root)' : `${outputPath}/index.html`
  console.log(`Generated: ${displayPath}`)
}

console.log('i18n build complete!')
