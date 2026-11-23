import { readFileSync } from 'node:fs'

/** The two specs this site renders, as scripts/sync-openapi.mjs writes them. */
export type SpecName = 'openapi' | 'partner-openapi'

/** A spec the build reads: `openapi` is the public API, `partner-openapi` the print partner API. */
export function readSpec(name: SpecName = 'openapi'): any {
  return JSON.parse(readFileSync(new URL(`../public/${name}.json`, import.meta.url), 'utf8'))
}
