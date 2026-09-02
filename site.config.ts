/**
 * Where this portfolio is served from. Absolute URLs in the document head
 * (og:url, og:image) have to name a host, so they are built from here and
 * injected at build time by the plugin in vite.config.ts.
 *
 * Change this one line when the portfolio gets its own domain.
 *
 * Not to be confused with the landing-page business at nicolamarmugi.com,
 * which the JSON-LD Person block points to on purpose.
 */
export const SITE_ORIGIN = 'https://nm-portfolio-umber.vercel.app'
