## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

## Project conventions

See `README.md` for an overview, `docs/ARCHITECTURE.md` for how the pieces fit and `docs/CONTENT.md` for content recipes. Keep them up to date when behaviour changes.

- Photo gallery, subdomain of the portfolio (`1nicoan` repo). It follows that repo's architecture and design tokens: when in doubt, do it the way it is done there.
- Spanish only. Code, comments and docs in English.
- The page is meant to be read without words. Photos carry no captions on the grid, controls are icons, the only things above the grid are the one-word title and the theme toggle, and the only thing below it is the back-to-top arrow, and the only visible text is the lightbox caption. Do not add copy without being asked.

### Routes

- Every page and its path is declared in `src/i18n/routes.ts` (`ROUTES`, `path`). Never write a URL by hand.
- `src/pages/` files are thin: each renders a component from `src/components/pages/`. A new page needs an entry in `ROUTES`, a page component and a file under `src/pages/`.
- Navigation is client-side (`<ClientRouter />`).

### Content

- Identity, links and domains → `src/config/site.ts`.
- Interface copy and aria-labels → `src/i18n/ui.ts`.
- Grid layout → `GALLERY` in `src/config/site.ts` (seed and row rules per screen size), computed at build time by `src/lib/layout.ts`. Photos are never cropped; keep the layout static (no layout JS).
- Photos → one JSON per photo in `src/content/photos/` (schema in `src/content.config.ts`). Files go in `src/content/photos/img/` and are referenced as `"image": "./img/name.jpg"`; without one a placeholder is drawn. Newest `date` comes first.

### Styling and motion

- Tailwind CSS v4: tokens, light/dark colours and shared classes (`.wrap`, `.section`, `.label`, `.btn`, `.icon-btn`, `.dots`, `.mosaic`, `.lightbox`…) in `src/styles/index.css`; utilities for one-off layout. Token values are the portfolio's: keep them in sync.
- Light and dark themes via `data-theme` on `<html>` (inline script in `BaseLayout.astro`). Always use the colour tokens (`bg-bg`, `text-muted`, `border-line`…), never raw colours.
- Motion is progressive enhancement: every element is fully visible at rest, so the page reads the same without JS and with `prefers-reduced-motion`.
- Behaviour is opt-in through data attributes: `data-reveal`, `data-theme-toggle`, `data-photo`, `data-lightbox-prev`, `data-lightbox-next`, `data-lightbox-close`, `data-lightbox-backdrop`.
- Client code: one entry, `src/lib/client.ts`. Clicks are delegated on `document`; per-element setup runs on `astro:page-load` because the router swaps pages without reloading. Never add a one-off `<script>` that runs only on first load.
- Photos are served as the original files: do not add `<Image>`, `getImage()`, `srcset` or lazy loading.
- The page opens behind the page curtain (a sweeping bar) and waits for every photo; theme changes run behind it too (`src/lib/loader.ts`, `PageLoader.astro`).
