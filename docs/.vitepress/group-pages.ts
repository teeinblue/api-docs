import { specTags } from './spec-tags'

/**
 * One page per tag. A tag's description is the only place the spec keeps a
 * group's narrative -- rate limiting, how to send a file, the upload flow -- and
 * no endpoint page shows it, so each gets a page of its own, listing the
 * group's endpoints underneath.
 */
export function groupPaths(spec: any, prefix: string) {
  return specTags(spec).map((tag) => {
    const endpoints = tag.operations.map(
      (operation) =>
        `- [\`${operation.method} ${operation.path}\`](${prefix}${operation.operationId})` +
        (operation.summary ? ` — ${operation.summary}` : ''),
    )

    return {
      params: { slug: tag.slug, name: tag.name },
      content: [`# ${tag.name}`, tag.description, endpoints.length ? '## Endpoints' : '', endpoints.join('\n')]
        .filter(Boolean)
        .join('\n\n'),
    }
  })
}
