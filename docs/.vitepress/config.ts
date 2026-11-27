import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { defineConfig } from 'vitepress'
import { useSidebar } from 'vitepress-openapi'
import { readSpec } from './read-spec'
import { specOperations, specTags } from './spec-tags'

const publicSpec = readSpec('openapi')
const partnerSpec = readSpec('partner-openapi')

/**
 * Every generated page, keyed by its path under docs/. Both the endpoint pages
 * ([operationId].paths.ts) and the tag pages (groups/[slug].paths.ts) are made up
 * at build time, so their files hold no words for the search to read: this is what
 * it reads instead, in _render and _splitIntoSections below.
 */
const generatedPages = new Map<string, { titles: string[]; text: string }>()

for (const [prefix, spec] of [['api', publicSpec], ['partner-api', partnerSpec]] as const) {
  for (const operation of specOperations(spec)) {
    generatedPages.set(`${prefix}/${operation.operationId}`, {
      titles: [...operation.tags.slice(0, 1), operation.summary],
      text: `${operation.method} ${operation.path} ${operation.description}`,
    })
  }

  for (const tag of specTags(spec)) {
    generatedPages.set(`${prefix}/groups/${tag.slug}`, {
      titles: [tag.name],
      text: tag.description,
    })
  }
}

/**
 * The generated page a markdown path stands for, absolute or relative to docs/.
 */
const generatedPageAt = (path: string) =>
  generatedPages.get(path.replace(/\\/g, '/').match(/((?:partner-)?api\/(?:groups\/)?[^/]+)\.md$/)?.[1] ?? '')

/** The tag pages of a spec, as the sidebar lists them. */
const groupLinks = (spec: any, prefix: string) =>
  specTags(spec)
    .filter((tag) => tag.description)
    .map((tag) => ({ text: tag.name, link: `${prefix}groups/${tag.slug}` }))

export default defineConfig({
  title: 'Teeinblue API',
  description: 'Public API and Print Partner API for Teeinblue.',
  cleanUrls: true,

  // vitepress-openapi 0.2 imports vitepress's client API (useData) from its own
  // client bundle, which Node can only resolve when the pre-render bundles it in.
  vite: {
    ssr: { noExternal: ['vitepress-openapi'] },
  },

  // A generated page has no heading of its own to take a title from: see the
  // [operationId].paths.ts and groups/[slug].paths.ts beside each section.
  transformPageData(pageData) {
    const title = pageData.params?.summary ?? pageData.params?.name
    if (title) pageData.title = title
  },

  // The host (DigitalOcean App Platform) serves /foo from foo/index.html but never tries
  // foo.html, so every page is also written in the folder layout VitePress prescribes for
  // such hosts: https://vitepress.dev/guide/routing#generating-clean-urls
  async buildEnd({ outDir }) {
    for (const file of await readdir(outDir, { recursive: true })) {
      if (!file.endsWith('.html') || basename(file) === 'index.html' || file === '404.html') continue
      const folderIndex = join(outDir, file.slice(0, -'.html'.length), 'index.html')
      await mkdir(dirname(folderIndex), { recursive: true })
      await copyFile(join(outDir, file), folderIndex)
    }
  },

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],

  themeConfig: {
    siteTitle: 'Teeinblue API',

    search: {
      provider: 'local',
      options: {
        // A generated page has no file of its own, so the indexer reads it from
        // disk as empty and drops it before _splitIntoSections is ever reached.
        // Hand it the page's own words instead; a real page renders as usual.
        async _render(src, env, md) {
          const page = generatedPageAt(env.relativePath)
          if (page) return `<h1>${page.titles.at(-1) ?? ''}</h1><p>${page.text}</p>`

          const html = await md.renderAsync(src, env)
          return env.frontmatter?.search === false ? '' : html
        },

        miniSearch: {
          // Indexed as one section per page: a generated page carries no
          // headings to split on, and its own URL is where a hit should land.
          _splitIntoSections(file: string) {
            const page = generatedPageAt(file)
            if (!page) return undefined
            return [{ anchor: '', titles: page.titles, text: page.text }]
          },
        },
      },
    },

    nav: [
      { text: 'Public API', link: '/api/', activeMatch: '^/api/' },
      { text: 'Partner API', link: '/partner-api/', activeMatch: '/partner-api/' },
      { text: 'teeinblue.com', link: 'https://teeinblue.com', target: '_blank' },
    ],

    sidebar: {
      '/api/': [
        {
          text: 'Public API',
          items: [{ text: 'Overview', link: '/api/' }, ...groupLinks(publicSpec, '/api/')],
        },
        ...useSidebar({ spec: publicSpec, linkPrefix: '/api/' }).generateSidebarGroups(),
      ],

      '/partner-api/': [
        {
          text: 'Print Partner API',
          items: [
            { text: 'Overview', link: '/partner-api/' },
            { text: 'Shipment notification', link: '/partner-api/shipment-notification' },
            ...groupLinks(partnerSpec, '/partner-api/'),
          ],
        },
        ...useSidebar({ spec: partnerSpec, linkPrefix: '/partner-api/' }).generateSidebarGroups(),
      ],
    },

    socialLinks: [],

    footer: {
      message: 'Teeinblue API documentation.',
      copyright: 'Copyright 2026 Teeinblue',
    },
  },
})
