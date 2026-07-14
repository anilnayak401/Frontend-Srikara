// Single source of truth for admin module keys and role-based access.
// IMPORTANT: firestore.rules duplicates ROLE_DEFAULT_PERMISSIONS in rules-language
// (Firestore rules cannot import JS). Keep both in sync when this changes.

export const MODULES = [
  'analytics', 'heatmaps', 'appointments',
  'doctors', 'departments', 'blogs', 'news', 'gallery', 'jobs',
  'testimonials', 'faqs', 'downloads', 'media',
  'homepage', 'aboutpage', 'careers_customizer', 'branches',
  'seo', 'admin_users', 'history',
]

export const ROLES = ['Super Admin', 'Admin', 'Marketing Admin', 'HR', 'Doctor Admin', 'Reception']

export const MODULE_LABELS = {
  analytics: 'Traffic Analytics',
  heatmaps: 'Heatmaps & Clicks',
  appointments: 'Appointments & CRM',
  doctors: 'Doctors Directory',
  departments: 'Specialties & Depts',
  blogs: 'Blogs & Articles',
  news: 'News & Alerts',
  gallery: 'Media Gallery',
  jobs: 'Careers Board',
  testimonials: 'Testimonials CMS',
  faqs: 'FAQs CMS',
  downloads: 'Downloads CMS',
  media: 'Media Library',
  homepage: 'Homepage Layout',
  aboutpage: 'About Us Page',
  careers_customizer: 'Careers Landing',
  branches: 'Branch Landing Pages',
  seo: 'SEO Meta Tags',
  admin_users: 'Admin User Management',
  history: 'Audit & History Logs',
}

// admin_users is intentionally excluded here — it is never grantable via
// extraPermissions, it is hardcoded to role === 'Super Admin' only.
export const ROLE_DEFAULT_PERMISSIONS = {
  'Super Admin': MODULES.filter(m => m !== 'admin_users'),
  'Admin': MODULES.filter(m => m !== 'admin_users' && m !== 'history'),
  'Marketing Admin': ['analytics', 'heatmaps', 'departments', 'blogs', 'news', 'gallery', 'testimonials', 'faqs', 'downloads', 'media', 'homepage', 'aboutpage', 'branches', 'seo'],
  'HR': ['jobs', 'careers_customizer'],
  'Doctor Admin': ['doctors'],
  'Reception': ['analytics', 'appointments'],
}

// Modules that can be granted/revoked per-admin via the Admin User Management screen.
export const OVERRIDABLE_MODULES = MODULES.filter(m => m !== 'admin_users')

/**
 * userDoc shape (Firestore users/{uid} doc, or the equivalent mock-mode object):
 *   { role, active, extraPermissions?: string[], revokedPermissions?: string[] }
 */
export function getEffectivePermissions(userDoc) {
  if (!userDoc || userDoc.active === false) return []
  if (userDoc.role === 'Super Admin') return [...MODULES]
  const set = new Set(ROLE_DEFAULT_PERMISSIONS[userDoc.role] || [])
  ;(userDoc.extraPermissions || []).forEach(m => { if (m !== 'admin_users') set.add(m) })
  ;(userDoc.revokedPermissions || []).forEach(m => set.delete(m))
  return [...set]
}

export function hasModuleAccess(userDoc, moduleKey) {
  return getEffectivePermissions(userDoc).includes(moduleKey)
}
