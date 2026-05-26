import { lbNagar } from './lb-nagar'
import { peerzadiguda } from './peerzadiguda'
import { kompally } from './kompally'
import { lakdikapul } from './lakdikapul'
import { ecil } from './ecil'
import { miyapur } from './miyapur'
import { vijayawada } from './vijayawada'
import { rajahmundry } from './rajahmundry'
import { rtcXRoads } from './rtc-x-roads'

export { lbNagar, peerzadiguda, kompally, lakdikapul, ecil, miyapur, vijayawada, rajahmundry, rtcXRoads }

export const branches = [
  ecil,
  lbNagar,
  peerzadiguda,
  kompally,
  lakdikapul,
  rtcXRoads,
  miyapur,
  vijayawada,
  rajahmundry,
]

export const getBranchBySlug = (slug) => branches.find(b => b.slug === slug)
