import siteConfig from '@site-config'

import { mergeSiteFeatures } from './siteFeatures.js'

let cached

/**
 * Returns the active site manifest. Resolved at build time from `sites/<SITE_ID>/site.config.js`.
 */
export function getSiteConfig() {
  if (!cached) {
    cached = {
      ...siteConfig,
      features: mergeSiteFeatures(siteConfig.features),
    }
  }
  return cached
}
