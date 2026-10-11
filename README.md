# Everline Advisory

Astro rebuild of the Framer site at https://everlineadvisory.framer.website. It's a static single page with no framework runtime.

## Commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Dev server at http://localhost:4321           |
| `npm run build`   | Production build into `dist/`                 |
| `npm run preview` | Serve the production build locally            |
| `npm run check`   | Type-check `.astro` / `.ts` files             |

## Where things live

```
src/
  data/site.ts              all copy (nav, hero, about, services, booking, contact)
  content/faq/*.md          FAQ entries (content collection, sorted by `order`)
  styles/tokens.css         colours, type + spacing scales, motion
  styles/global.css         fonts, reset, shared primitives, scroll-reveal
  components/               one component per section
  components/illustrations  the three service illustrations (inline SVG, live text)
  scripts/reveal.ts         one IntersectionObserver for scroll reveals
  scripts/calendar.ts       booking-panel date logic (shared server/client)
public/fonts/               self-hosted, latin-subset variable fonts (≈83 KB total)
```

- **Edit copy:** `src/data/site.ts` and `src/content/faq/`.
- **Add a service:** add an entry to `services` in `site.ts` and an illustration component.
- **Booking slots, open weekdays:** `booking.panel` in `site.ts`.

## Notes

- **Type/spacing scale:** the live Framer site resolves its "fluid" clamps as a step: minimum values below 1440px, maximum at 1440px and up. `tokens.css` copies that behaviour. To make the scale truly fluid, swap each pair for a `clamp()` (see the comment in that file).
- **Hero image:** this is the LCP element, so it never gets a reveal animation. It is served as AVIF/WebP with `fetchpriority="high"`.
- **Contact form:** wired for [Netlify Forms](https://docs.netlify.com/forms/setup/) (`data-netlify`, honeypot, `/thanks/` success page). Submissions only work on a Netlify deploy, not locally.
- **Booking panel:** the original component never submitted anywhere. Here, "Confirm" scrolls to the contact form and prefills the chosen slot in the message. Replace it with a Cal.com or Calendly embed when real scheduling is needed.
- **Reveals** respect `prefers-reduced-motion` and are skipped entirely without JS.

## Deploy (Netlify)

`netlify.toml` sets the build command, the publish dir (`dist`), Node 22, long-cache headers for `/_astro/*` and `/fonts/*`, and basic security headers. Connect the repo in Netlify, or run:

```bash
npx netlify deploy --build
```
