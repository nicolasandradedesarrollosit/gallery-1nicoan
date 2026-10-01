# Editing content

Recipes for the common changes. After any change, run `npm run check` (it catches
an invalid photo file) and look at `/` in both themes.

## Add a photo

1. Put the file in `src/content/photos/img/`. Any proportions work. It is published
   exactly as it is (no resizing, no recompression), so export it at the size and
   quality you want visitors to get. The page waits for every photo before showing.
2. Create a JSON file next to the others in `src/content/photos/`. The file name is
   only an id.

```json
{
  "image": "./img/costanera.jpg",
  "alt": "Atardecer sobre el río Paraná",
  "title": "Costanera",
  "location": "Rosario",
  "date": "2026-09-14"
}
```

- `alt` and `date` are required. `alt` describes the photo for screen readers and
  is never shown on the grid.
- `date` sorts the feed, newest first.
- `title` and `location` are optional; with the date they form the line under the
  enlarged photo ("Costanera · Rosario · sept 2026").
- `"draft": true` hides a photo.

## Replace a placeholder

The `foto-NN.json` files have no `image`, so a dot grid with a number is drawn in
their place, shaped by `ratio` (`3:4`, `4:5`, `1:1`, `3:2` or `16:9`). Add an
`image` to one and it becomes a real photo; `ratio` is then ignored and can be
removed. Delete the placeholders you do not need.

## Change how the wall is arranged

`GALLERY` in `src/config/site.ts`:

- `seed`: any other number reshuffles which rows are big and which are small. The
  order of the photos does not change.
- `layouts`: one set of rules per screen size. `counts` are the row sizes to pick
  from (`[1, 2, 3, 4]` allows anything from a single photo to four in a row).
  `minSum` and `maxSum` bound a row's width divided by its height: raise `minSum`
  if rows get too tall, lower `maxSum` if they get too thin.

Adding or removing a photo rearranges the rows after it.

## Change name, email, links or the domain

`src/config/site.ts`:

- `SITE.name`, `SITE.email`, `SITE.social`: used in the metadata only.
- `SITE.url` is the public domain of the gallery. It feeds canonical URLs, the
  sitemap and social previews, so it must be the real one before going live.
- `SITE.portfolioUrl` identifies the author in the JSON-LD; nothing links to it.

## Change a text of the interface

Labels and meta descriptions are in `src/i18n/ui.ts`. To add a string, declare it
in the `Dictionary` interface first, then fill it in.

## Add a page

1. Declare it in `ROUTES` (`src/i18n/routes.ts`).
2. Create the page component in `src/components/pages/`, rendering `BaseLayout`.
3. Add a route file under `src/pages/` that renders it.
4. Add its title and description to `meta` in `src/i18n/ui.ts`.

## Add an icon

Paste the inner markup of a 24×24 stroke SVG (for example from
[Lucide](https://lucide.dev)) into `ICONS` in `src/components/ui/Icon.astro`.
