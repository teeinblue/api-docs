import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import yaml from 'js-yaml'

/**
 * The YAML specs are the source of truth, edited in this repo by PR as before.
 * The docs read JSON, so every build converts them first: the theme and the
 * dynamic routes import docs/public/*.json directly.
 */
const specs = [
  { from: '../openapi.yaml', to: '../docs/public/openapi.json' },
  { from: '../partner-openapi.yaml', to: '../docs/public/partner-openapi.json' },
]

mkdirSync(new URL('../docs/public', import.meta.url), { recursive: true })

for (const { from, to } of specs) {
  const src = new URL(from, import.meta.url)
  const dest = new URL(to, import.meta.url)
  const spec = yaml.load(readFileSync(src, 'utf8'))
  writeFileSync(dest, JSON.stringify(spec, null, 2))
  console.log(`Synced ${from.replace('../', '')} -> ${to.replace('../', '')}`)
}
