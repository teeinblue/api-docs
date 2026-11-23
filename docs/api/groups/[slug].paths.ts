import { readSpec } from '../../.vitepress/read-spec'
import { groupPaths } from '../../.vitepress/group-pages'

export default {
  paths: () => groupPaths(readSpec('openapi'), '/api/'),
}
