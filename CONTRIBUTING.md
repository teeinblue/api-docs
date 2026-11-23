# Teeinblue API docs

The documentation site for both Teeinblue APIs, built with
[VitePress](https://vitepress.dev) and
[vitepress-openapi](https://vitepress-openapi.vercel.app). Published at
[docs.teeinblue.com](https://docs.teeinblue.com).

| Section | Spec | Audience |
|---|---|---|
| `/api/` | `openapi.yaml` | Merchants using the public API |
| `/partner-api/` | `partner-openapi.yaml` | Print partners implementing the partner API |

## Running it

```bash
yarn install
yarn docs:dev      # http://localhost:5173
yarn docs:build    # dead links, spec parse errors, missing operationIds
yarn docs:preview
```

## How it fits together

The **YAML specs at the repo root are the source of truth**, edited by PR. Everything else is
generated from them:

- `scripts/sync-openapi.mjs` converts both specs to `docs/public/*.json` before every dev and
  build run. Those JSON files are generated, so they are not committed.
- `docs/api/[operationId].paths.ts` and `docs/partner-api/[operationId].paths.ts` make **one
  page per endpoint**, named by its `operationId`. Adding an endpoint to a spec adds its page
  — there is no page to write. An operation without an `operationId` fails the build, because
  it would otherwise publish at `/undefined`.
- `docs/api/groups/[slug].paths.ts` makes **one page per tag**, carrying the tag's description.
  Tag descriptions are where the specs keep their narrative (rate limiting, the upload flow,
  the asset-library rules), and no endpoint page shows it — including `Rate Limiting`, a tag
  with no endpoints at all.
- `docs/.vitepress/config.ts` builds the sidebar from the specs and feeds the local search the
  words a generated page has no file to hold.

The public API is the site's default spec. Partner endpoint pages render through
`docs/.vitepress/theme/PartnerOperation.vue`, which passes the partner spec to the plugin.
