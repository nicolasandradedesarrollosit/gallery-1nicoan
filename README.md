# Nicolás Andrade — gallery

Photo gallery of Nicolás Andrade, served as a subdomain of the
[portfolio](https://github.com/nicolasandradedesarrollosit/1nicoan). A static,
single-page site built with Astro and Tailwind CSS: a one-word title, a feed of
photos and a theme toggle.

It shares the portfolio's architecture and design tokens; when those change there,
mirror them here.

## Stack

- [Astro 7](https://astro.build) with static output and client-side navigation (`<ClientRouter />`)
- [Tailwind CSS v4](https://tailwindcss.com) through the Vite plugin
- TypeScript in strict mode
- Geist and Geist Mono via the Astro Fonts API
- Deployed to Vercel (`@astrojs/vercel`)

There is no UI framework and no animation library: interactivity is a few small
TypeScript modules, and most motion is plain CSS.

## Getting started

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev       # dev server at http://localhost:4321
```

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload           |
| `npm run check`   | Type-check `.astro` and `.ts` files            |
| `npm run build`   | Build the static site into `dist/`             |
| `npm run preview` | Serve the production build locally             |

Run `npm run check` and `npm run build` before pushing; there is no test suite.

## Routes

`/` is the only page. Also generated: `/404`, `/robots.txt` and `/sitemap-index.xml`.

## Project structure

```
public/                 Static files served as-is (favicon, social image)
src/
  config/site.ts        Identity, links, domain, grid layout rules
  content/photos/       One JSON file per photo (+ img/ for the files)
  content.config.ts     Schema of the photos collection
  i18n/
    routes.ts           Every page and its path
    ui.ts               Interface copy (mostly labels for assistive technology)
  lib/                  SEO helpers, photo queries and client-side code
    client.ts           Single client entry point
    layout.ts           Splits the photos into justified rows
    lightbox.ts         Opens, moves and closes the enlarged photo
    loader.ts           Page curtain: first load (waits for the photos) and theme changes
    motion/             Scroll reveal
  components/
    layout/             Header (title and theme toggle), footer (back to top only), curtain
    gallery/            Photo grid, tile and lightbox
    pages/              One component per page; route files render these
    seo/                Meta tags and JSON-LD
    ui/                 Shared pieces (icons, photo visual)
  layouts/BaseLayout.astro
  pages/                Route files (thin wrappers)
  styles/index.css      Design tokens and shared component classes
```

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how content, theming, motion and the client code fit together.
- [docs/CONTENT.md](docs/CONTENT.md) — how to add a photo or change the site details.
- [AGENTS.md](AGENTS.md) — conventions for anyone (or any tool) changing the code.

## Before going live

- Set the real domains in `SITE.url` and `SITE.portfolioUrl` (`src/config/site.ts`);
  they drive canonical URLs, the sitemap, Open Graph tags and the JSON-LD.
- Replace the placeholder photos in `src/content/photos/`.
