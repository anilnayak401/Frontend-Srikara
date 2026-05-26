/**
 * assetUrl(path)
 * Prepends Vite's BASE_URL so public-folder assets resolve correctly
 * on both localhost and GitHub Pages subdirectory deployments.
 *
 * Usage:
 *   import { assetUrl } from '@/lib/assetUrl'
 *   <img src={assetUrl('doctors/akhil-dadi.png')} />
 *
 * Result:
 *   localhost  → /doctors/akhil-dadi.png
 *   GitHub Pages → /sri/doctors/akhil-dadi.png
 */
export function assetUrl(path) {
  // Remove any leading slash so we don't double-up
  const clean = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${clean}`
}
