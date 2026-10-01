/**
 * Central site configuration. Identity and links live here: components and pages
 * read from this file and never hardcode them.
 */

export const SITE = {
  name: 'Nicolás Andrade',
  /** Placeholder until the final domain is set. */
  url: 'https://gallery.nicolasandrade.dev',
  /** The main site this gallery is a subdomain of; used in the JSON-LD only. */
  portfolioUrl: 'https://nicolasandrade.dev',
  email: 'nicolasandradedesarrollos@gmail.com',
  defaultOgImage: '/og-default.png',
  social: {
    github: 'https://github.com/nicolasandradedesarrollosit',
    linkedin: 'https://www.linkedin.com/in/nicol%C3%A1s-andrade-a5a7a136a',
  },
} as const;

/**
 * How the feed is laid out (see lib/layout.ts). Each screen size splits the photos
 * into rows on its own: `counts` are the row sizes to pick from, and a row's width /
 * height must stay between `minSum` and `maxSum`. Change `seed` to reshuffle.
 */
export const GALLERY = {
  seed: 7,
  layouts: {
    /** Phones. */
    base: { counts: [1, 2, 3], minSum: 0.7, maxSum: 2.8 },
    /** From 48rem. */
    md: { counts: [2, 3], minSum: 1.5, maxSum: 4.2 },
    /** From 64rem. */
    lg: { counts: [1, 2, 3, 4], minSum: 1.9, maxSum: 5.6 },
  },
} as const;

/** The site has a single locale: <html lang>, Open Graph locale, date formatting. */
export const LOCALE = { htmlLang: 'es-AR', ogLocale: 'es_AR' } as const;
