import { LOCALE, SITE } from '../config/site';
import { ui } from '../i18n/ui';
import { path } from '../i18n/routes';

export const absUrl = (pathname: string) => new URL(pathname, SITE.url).href;

type JsonLd = Record<string, unknown>;

// Same node id as the portfolio, so both sites describe one person.
const PERSON_ID = `${SITE.portfolioUrl}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

export function personLd(): JsonLd {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    url: SITE.portfolioUrl,
    email: `mailto:${SITE.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Rosario', addressCountry: 'AR' },
    sameAs: Object.values(SITE.social),
  };
}

export function websiteLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absUrl(path()),
    name: ui.meta.home.title,
    description: ui.meta.home.description,
    inLanguage: LOCALE.htmlLang,
    author: { '@id': PERSON_ID },
  };
}

/** The photo feed of the home page. */
export function galleryLd(): JsonLd {
  return {
    '@type': 'ImageGallery',
    url: absUrl(path()),
    name: ui.meta.home.title,
    author: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

/** Wraps nodes in a single @graph that always includes Person and WebSite. */
export function graph(...nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': [personLd(), websiteLd(), ...nodes] };
}
