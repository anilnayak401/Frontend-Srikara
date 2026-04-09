# Srikara Hospitals — Website

A production-ready, multi-branch hospital website built with React 18, Vite, and Tailwind CSS. Features a cinematic frame-sequence hero, lazy-loaded disease search, full brand design system, and code-split routing across 9 branch locations.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| SEO | React Helmet Async |
| Utilities | clsx, tailwind-merge |

---

## Getting Started

```bash
# Install dependencies
npm install

# Development server → http://localhost:5173
npm run dev

# Production build → /dist
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
sri/
├── public/
│   ├── hero-frames/          # 297 JPG frames for canvas hero animation
│   ├── doctors/              # Doctor portrait images
│   └── srikara-logo.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── StickyNavbar.jsx      # Scroll-aware navbar with branch dropdown
│   │   │   ├── BranchSideNav.jsx     # Desktop side navigation
│   │   │   ├── Footer.jsx            # Brand-consistent footer
│   │   │   └── MobileBottomNav.jsx   # Mobile bottom tab bar
│   │   ├── sections/
│   │   │   ├── VideoHero.jsx         # Canvas frame-sequence hero (mobile fallback)
│   │   │   ├── AlphabetDiseaseSearch.jsx  # 2-column disease search panel
│   │   │   ├── AppointmentWidget.jsx
│   │   │   ├── DoctorProfile.jsx
│   │   │   └── ...
│   │   └── ui/               # Radix/shadcn primitives
│   ├── data/
│   │   └── branches/         # Per-branch data files (slug, hero, stats, doctor…)
│   ├── pages/
│   │   ├── BranchLandingPage.jsx     # Shared template for 8 branches
│   │   ├── PeerzadigudaPage.jsx      # Custom branch page
│   │   ├── SpecialtiesPage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── DoctorsPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── BookAppointmentPage.jsx
│   │   └── BranchesIndex.jsx
│   ├── App.jsx               # Routes + React.lazy code splitting
│   ├── main.jsx
│   └── index.css             # Global brand tokens + utility classes
├── tailwind.config.js        # Full brand color system
└── vite.config.js
```

---

## Brand Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#C2185B` | Headings, buttons, active states, icons |
| `primary-dark` | `#8E0038` | Button hover / pressed |
| `primary-light` | `#F8BBD0` | Tints, hero highlights |
| `primary-container` | `#FCE4EC` | Card backgrounds, chips |
| `secondary` | `#0F4C5C` | Accents, secondary buttons, hover |
| `secondary-dark` | `#082F3A` | Secondary hover |
| `surface-container` | `#F8E6EC` | Brand background light |
| `on-surface` | `#1A1A1A` | Body text |
| `on-surface-variant` | `#4A4A4A` | Muted text |

CSS variables are also available globally:

```css
var(--brand-primary)        /* #C2185B */
var(--brand-secondary)      /* #0F4C5C */
var(--brand-gradient)       /* linear-gradient(90deg, #C2185B, #0F4C5C) */
var(--brand-bg-light)       /* #F8E6EC */
```

### Typography

| Role | Font |
|---|---|
| Headings (h1–h6) | Manrope (display) |
| Body / Labels | Inter |

All headings default to `color: #C2185B` via global CSS.

### Reusable CSS Classes

```css
.btn-primary        /* Rose button, teal on hover */
.btn-secondary      /* Teal outline button */
.brand-gradient-text /* Gradient text: rose → teal */
.glass-card-light   /* Frosted glass, light theme */
.glass-card-dark    /* Frosted glass, dark theme */
.accent-bar         /* 3×48px gradient underline */
.skeleton           /* Shimmer loading placeholder */
```

---

## Key Features

### 1. Canvas Frame-Sequence Hero (`VideoHero.jsx`)

Plays 297 JPG frames as a 24 fps canvas animation — no MP4 required.

- Eagerly loads first 30 frames, lazy-loads the remaining 267
- Mobile (`< 768px`): canvas disabled, shows static fallback image
- Gradient overlays ensure text readability at all times
- Accepts `branch` prop and optional `children` for custom content

```jsx
<VideoHero branch={branchData}>
  <h1>Custom hero content</h1>
</VideoHero>
```

### 2. Disease Search Panel (`AlphabetDiseaseSearch.jsx`)

Two-column responsive layout combining alphabet filtering and free-text search.

**Left column — Find by Alphabet**
- A–Z circular buttons in a 7-column grid
- Click a letter → debounced fetch (100ms) → results cached in `Map`
- Active letter highlighted with brand color + glow shadow
- Clicking a letter clears the search input

**Right column — Search Diseases & Conditions**
- Text input with inline clear (×) and search button
- 300ms debounce on every keystroke
- Typing clears the active alphabet letter
- Separate cache (`Map`) for search results
- Skeleton loader while fetching, animated pill results, empty state

**Responsive behaviour**
- Desktop: side-by-side columns
- Mobile: search panel on top, alphabet below

```jsx
<AlphabetDiseaseSearch theme="light" />  {/* branch pages */}
<AlphabetDiseaseSearch theme="dark" />   {/* Specialties / Services pages */}
```

To connect a real API, replace the two async functions at the top of the file:

```js
async function fetchByLetter(letter) { /* GET /api/diseases?letter=A */ }
async function fetchByQuery(query)   { /* GET /api/diseases?q=arthritis */ }
```

### 3. Code Splitting (`App.jsx`)

Non-critical pages are lazy-loaded via `React.lazy` + `Suspense`:

```
BranchLandingPage  — eager (critical path)
PeerzadigudaPage   — eager (critical path)
SpecialtiesPage    — lazy chunk
ServicesPage       — lazy chunk
AboutPage          — lazy chunk
DoctorsPage        — lazy chunk
BookAppointmentPage— lazy chunk
BranchesIndex      — lazy chunk
PlaceholderPage    — lazy chunk
```

A branded spinner (`#C2185B` border) shows during chunk loading.

### 4. Routing

```
/                          → redirect to /branches/lb-nagar
/branches/lb-nagar         → BranchLandingPage (LB Nagar data)
/branches/kompally         → BranchLandingPage (Kompally data)
/branches/lakdikapul       → BranchLandingPage
/branches/ecil             → BranchLandingPage
/branches/miyapur          → BranchLandingPage
/branches/secunderabad     → BranchLandingPage
/branches/vijayawada       → BranchLandingPage
/branches/rajahmundry      → BranchLandingPage
/branches/rtc-x-roads      → BranchLandingPage
/branches/peerzadiguda     → PeerzadigudaPage (custom)
/branches                  → BranchesIndex
/specialties               → SpecialtiesPage
/services                  → ServicesPage
/doctors                   → DoctorsPage
/about                     → AboutPage
/book                      → BookAppointmentPage
/technology                → PlaceholderPage
```

---

## Branch Pages

Each branch is driven by a data file in `src/data/branches/`. The shared `BranchLandingPage` template renders:

1. Canvas hero (`VideoHero`)
2. Centers of Excellence cards
3. Branch highlights + image
4. Doctor spotlight with stats
5. Infrastructure gallery
6. Google Maps embed + reviews card
7. Disease search panel (`AlphabetDiseaseSearch`)
8. Emergency banner

### Branch Data Shape

```js
export const myBranch = {
  slug:            'my-branch',
  title:           'My Branch',
  subtitle:        'Short tagline',
  heroHeadline:    'Main headline text.',
  heroHighlight:   'Highlighted second line.',
  description:     'One paragraph description.',
  heroImage:       'https://…',          // fallback for mobile hero
  heroStats:       [{ value: '99%', label: 'Success Rate' }, …],
  specialtiesCards:[{ icon: '🤖', title: '…', description: '…' }, …],
  highlights:      ['Highlight one', 'Highlight two'],
  doctor:          { name, title, surgeries, successRate, experience, bio, image },
  infrastructure:  [{ title, desc, gradient }, …],
  address:         '…',
  phone:           '040-…',
  emergencyPhone:  '040-…',
  googleRating:    4.8,
  googleReviewCount:'2.7K+',
  googleMapEmbed:  'https://www.google.com/maps/embed?…',
  branchLogo:      'https://…',
}
```

### Adding a New Branch

1. Create `src/data/branches/my-branch.js` following the shape above
2. Export it and add to `src/data/branches/index.js`
3. Add a route in `App.jsx`:
   ```jsx
   <Route path="/branches/my-branch" element={<BranchLandingPage branch={myBranch} />} />
   ```

---

## Performance Notes

- Hero frames are served from `/public/hero-frames/` (297 × ~15 KB JPGs)
- Canvas animation runs at 24 fps via `setTimeout` + `requestAnimationFrame`
- All below-fold images use `loading="lazy"`
- `section` elements have `contain: layout style` to limit paint scope
- Disease search results are cached client-side — no repeated fetches per session

---

## License

© 2025 Srikara Hospitals. All rights reserved.
#   s r i k a r a  
 #   s r i k a r a  
 