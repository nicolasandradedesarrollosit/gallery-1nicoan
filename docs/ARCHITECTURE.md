# Architecture

How the site is put together and why. For day-to-day edits see
[CONTENT.md](CONTENT.md); for the rules to follow when changing code see
[AGENTS.md](../AGENTS.md).

The gallery is a subdomain of the portfolio and deliberately mirrors its
architecture and design tokens, cut down to what a single page of photos needs.

## Principles

1. **Nothing is hardcoded in components.** Identity lives in `config/`, photos in
   `content/`, interface copy in `i18n/ui.ts`. Components only lay it out.
2. **Static first.** Every page is built to HTML. JavaScript adds behaviour on top
   and the site stays readable without it. Photos are the exception to "optimize
   everything": they are published untouched.
3. **Motion is progressive enhancement.** Every animated element is fully visible in
   its resting state, so the page looks the same with JavaScript off or with
   `prefers-reduced-motion` on.
4. **No words where a photo will do.** Above the grid there is one word and the theme
   toggle, the grid has no captions and controls are
   icons. Most of `i18n/ui.ts` is labels for assistive technology.

## Routing

There is one page, `/`, and one locale, Spanish. `src/i18n/routes.ts` is still the
single source of truth for URLs (`ROUTES`, `path(route)`), and interface copy still
goes through a typed dictionary (`Dictionary` in `i18n/ui.ts`), so a second page or
locale can be added the way the portfolio does it.

Route files in `src/pages/` are thin wrappers that render a component from
`src/components/pages/`.

## Content

| What                              | Where                          |
| --------------------------------- | ------------------------------ |
| Name, email, social links, domains | `src/config/site.ts`          |
| Photos                            | `src/content/photos/*.json`    |

Photos are an Astro content collection (`src/content.config.ts`) validated with
Zod. `src/lib/photos.ts` returns them newest first and derives what the components
need: the zero-padded number, the proportions and the lightbox caption.

A photo without an `image` is drawn as a placeholder (dot grid + number) with the
proportions given in `ratio`, so the layout can be built before the photos exist.

## Layout and SEO

`BaseLayout.astro` owns the document: fonts, meta tags, JSON-LD, the header, footer,
page curtain and the client script.

- `components/seo/SEO.astro` — title, description, canonical, Open Graph.
- `lib/seo.ts` — JSON-LD builders. Every page gets `Person` and `WebSite`; the home
  page adds an `ImageGallery`. The `Person` node uses the portfolio's `@id`, so both
  sites describe the same person.
- `@astrojs/sitemap` generates the sitemap.

## Styling

Tailwind CSS v4, configured in CSS (`src/styles/index.css`), in three layers:

- **Tokens.** Raw colours are CSS variables on `:root`, redefined for the dark theme.
  `@theme inline` exposes them as utilities (`bg-bg`, `text-muted`, `border-line`,
  `text-accent`…). Components use tokens only, never raw colours. The values are the
  portfolio's.
- **Base.** Element defaults, focus ring, reduced-motion reset.
- **Components.** Shared classes: `.wrap`, `.section`, `.label`, `.btn`, `.icon-btn`,
  `.dots`, `.mosaic`, `.lightbox`, `.loader`… One-off layout stays in utility classes in the
  markup.

### Theme

The theme is the `data-theme` attribute on `<html>`. An inline script in the head
of `BaseLayout.astro` sets it before first paint (stored choice, else the system
preference) and again after every client-side navigation, because the router
replaces the attributes of `<html>`. A media query covers visitors without
JavaScript.

## The grid

The feed is hung like a wall of frames: justified rows of uneven size. Every row
fills the width and its photos share one height, so each photo is as wide as its
proportions ask for and none is cropped. Photos stay in order, newest first; what
varies is how many each row takes.

- `lib/layout.ts` (`justify`) splits the photos into rows at build time. The size of
  each row is picked from a seeded random generator, so builds are reproducible, and
  then corrected so no row ends up too tall or too short.
- `GALLERY` in `config/site.ts` holds the seed and one set of rules per screen size
  (phones, from 48rem, from 64rem). Each size gets its own split, so the composition
  really changes between them.
- `PhotoGrid.astro` writes the result on each item as custom properties (`--f-*`, its
  share of the row; `--n-*`, the row's size). `.mosaic` in the CSS turns them into
  widths inside a wrapping flex container: the widths of a row add up to 100%, so
  rows break on their own. No layout JavaScript and no per-row markup.

Each `PhotoTile` is a `<button>` whose accessible name is the photo's `alt`.

Photos are **not** optimized, on purpose. `PhotoVisual.astro` renders a plain
`<img>` pointing at the original file: no resizing, no re-encoding, no `srcset`, no
lazy loading. The lightbox shows that same file, so it opens instantly. The cost is
weight, which is why the page opens behind the curtain (below).

## Client-side code

Navigation is client-side (`<ClientRouter />`), which changes how scripts must be
written. There is a single entry point, `src/lib/client.ts`, imported once from
`BaseLayout`:

- **Clicks are delegated on `document`**, keyed by data attributes. They keep
  working after the page is swapped.
- **Per-element setup runs on `astro:page-load`**, which fires on first load and
  after every navigation.

| Attribute                 | Effect                                        | Module             |
| ------------------------- | --------------------------------------------- | ------------------ |
| `data-reveal`             | Fades in when scrolled into view              | `motion/scroll.ts` |
| `data-theme-toggle`       | Switches theme                                | `client.ts`        |
| `data-photo`              | Opens the lightbox on that photo              | `lightbox.ts`      |
| `data-lightbox-prev/next` | Moves to the previous / next photo            | `lightbox.ts`      |
| `data-lightbox-close`     | Closes the lightbox                           | `lightbox.ts`      |
| `data-lightbox-backdrop`  | Closes it when the click lands on it directly | `client.ts`        |

All motion is skipped with `prefers-reduced-motion`.

### Lightbox

`Lightbox.astro` renders one empty `<dialog>`. Each tile carries what the lightbox
shows as data attributes (`data-full`, `data-alt`, `data-meta`, `data-number`,
`data-ratio`), so `lib/lightbox.ts` only opens, moves and closes: it never knows
about the collection.

- `<dialog>` provides Esc and the focus trap. `←` and `→` move between photos and
  wrap around.
- Clicking the empty area around the photo closes it; clicking the photo does not.
- On close, focus returns to the tile of the photo that was last shown.
- A photo without a file shows the same placeholder, sized from `data-ratio`.

### Page curtain

A full-screen curtain with a thin bar sweeping across it (`PageLoader.astro`,
`lib/loader.ts`, `.loader` in the CSS), driven by `data-loading` on `<html>`. It is
used twice:

- **First load.** The head script in `BaseLayout.astro` raises it before first
  paint. `liftWhenLoaded()` lifts it once every `<img>` of the page has loaded (or
  failed, so a broken file cannot hold the page).
  Visitors never see photos popping in. Without JavaScript the curtain is never
  raised and the page shows as it loads.
- **Theme changes.** `withLoader()` raises it, switches the theme and lifts it.

With `prefers-reduced-motion` the bar is shown full and still.

## Build and deploy

`npm run build` produces static HTML in `dist/`. Stylesheets are inlined
(`build.inlineStylesheets: 'always'`) because the CSS is small. `vercel.json` adds
caching and basic security headers.
