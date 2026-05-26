import { VideoHero } from './VideoHero'

/**
 * HeroSection — thin wrapper around VideoHero for backward compatibility.
 */
export function HeroSection({ branch }) {
  return <VideoHero branch={branch} />
}
