import siteConfig from '@site-config'

/**
 * Returns the active site manifest. Resolved at build time from `sites/<SITE_ID>/site.config.js`.
 */
export function getSiteConfig() {
  return siteConfig
}
