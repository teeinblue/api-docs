import DefaultTheme from 'vitepress/theme'
import { theme, useOpenapi } from 'vitepress-openapi/client'
import spec from '../../public/openapi.json'
import 'vitepress-openapi/dist/style.css'
import './custom.css'
import ApiEndpoints from './ApiEndpoints.vue'
import PartnerOperation from './PartnerOperation.vue'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    // The public API is the site's default spec; the partner pages pass their own
    // through PartnerOperation.
    const openapi = useOpenapi({
      spec,
      config: {
        operation: {
          hiddenSlots: ['playground'],
        },
        // The spec's descriptions are wrapped at about 80 columns, and the plugin
        // renders each newline as a line break, cutting sentences mid-line.
        // Markdown's own rule joins the lines of a paragraph.
        markdown: {
          config: (md) => md.set({ breaks: false }),
        },
      },
    })
    theme.enhanceApp({ ...ctx, openapi })
    ctx.app.component('ApiEndpoints', ApiEndpoints)
    ctx.app.component('PartnerOperation', PartnerOperation)
  },
}
