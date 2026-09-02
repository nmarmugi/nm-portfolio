import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE_ORIGIN } from './site.config'

/**
 * Vite only substitutes `%VITE_*%` env vars in index.html, and env files are
 * gitignored here, so the origin would go missing on a clean deploy. This
 * swaps the `%SITE_ORIGIN%` placeholder from the checked-in constant instead,
 * in dev and in build alike.
 */
function siteOrigin() {
  return {
    name: 'site-origin',
    transformIndexHtml(html: string) {
      return html.replace(/%SITE_ORIGIN%/g, SITE_ORIGIN)
    },
  }
}

export default defineConfig({
  plugins: [react(), siteOrigin()],
})
