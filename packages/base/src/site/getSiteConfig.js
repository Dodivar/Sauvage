import siteConfig from '../../../../sites/original/site.config.js'

/**
 * Returns the active site manifest. Single entrypoint so future multi-site builds
 * can swap the resolved module without touching feature code.
 */
export function getSiteConfig() {
  return siteConfig
}
