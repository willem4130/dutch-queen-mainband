# The Dutch Queen — Full Band website

Official website of The Dutch Queen, the Queen tribute band's full electric show.

- Live site: https://thedutchqueen.com
- Content: shows, texts, gallery and links come from the [admin CMS](https://dutch-queen-admin.vercel.app) via `GET /api/bands/the-dutch-queen`. If the API fails, the site falls back to the JSON in `content/bands/the-dutch-queen/`.
- Stack: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- Vercel project: `dutch-queen-full-band-v4`

> **Frozen:** the client approved the design. Don't make visual, layout or copy changes without an explicit request. Behind-the-scenes fixes (SEO, performance, security, build) are fine.

## Requirements

- Node.js 20 (see `.nvmrc`)

## Install and run

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

## Environment

All settings are listed in [`.env.example`](./.env.example). They are all public `NEXT_PUBLIC_*` values:

- `NEXT_PUBLIC_BAND_ID` must stay `the-dutch-queen`. Never point this site at another band's id.
- Shows load from the CMS only when `NEXT_PUBLIC_USE_CMS` is exactly `true`.
- `NEXT_PUBLIC_CMS_API_URL` is the admin API base URL.
- The `*_URL` site-toggle values are optional; the defaults are in `src/lib/site-config.ts`.
- Analytics (`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_POSTHOG_*`) loads only after cookie consent.

## Checks

```bash
npm run lint
npm run type-check
npm test -- --run      # Vitest; plain `npm test` keeps watching
npm run build
```

The consent and analytics files (`src/lib/ga.ts`, `src/lib/analytics.ts`, `src/providers/AnalyticsProvider.tsx`, `src/components/CookieConsent.tsx`, `src/components/CookieSettingsButton.tsx`, `src/app/privacy/page.tsx`) and their tests are kept identical across the three band sites. Change them in all three together.

## Deploy

Production deploys run from this folder via the Vercel CLI:

```bash
cat .vercel/project.json   # projectName must be "dutch-queen-full-band-v4"
vercel --prod
```

A push to `main` can also trigger a production deploy. After deploying, load the live site and check the new build is there.

## More docs

- [ARCHIVE_SHOWS_GUIDE.md](./ARCHIVE_SHOWS_GUIDE.md): moving past shows from `upcoming` to `past` (`npm run archive-shows`).
- [VIDEO_SPECIFICATIONS.md](./VIDEO_SPECIFICATIONS.md): exact encoding of the hero videos (iOS needs H.264 Baseline with an audio track).

## Licence

Proprietary, all rights reserved. See [LICENSE](./LICENSE).
