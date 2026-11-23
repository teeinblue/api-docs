import { readSpec } from '../.vitepress/read-spec'
import { specOperations } from '../.vitepress/spec-tags'

// As /api, but drawn from the partner spec: PartnerOperation passes it to the
// plugin, whose default spec is the public API.
export default {
  paths() {
    return specOperations(readSpec('partner-openapi')).map(({ operationId, summary }) => ({
      params: { operationId, summary },
      content: `<PartnerOperation operation-id="${operationId}" />`,
    }))
  },
}
