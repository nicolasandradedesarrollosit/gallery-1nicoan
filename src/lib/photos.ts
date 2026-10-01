import { getCollection, type CollectionEntry } from 'astro:content';
import { LOCALE } from '../config/site';

export type Photo = CollectionEntry<'photos'>;

/** Published photos, newest first. */
export async function getPhotos(): Promise<Photo[]> {
  const photos = await getCollection('photos', ({ data }) => !data.draft);
  return photos.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Zero-padded position ("01"), used as the placeholder visual and the lightbox counter. */
export const photoNumber = (index: number) => String(index + 1).padStart(2, '0');

/** Width divided by height: from the file when there is one, else from `ratio`. */
export function photoRatio({ data }: Photo): number {
  if (data.image) return data.image.width / data.image.height;
  const [w, h] = data.ratio.split(':').map(Number);
  return w / h;
}

// Dates in the JSON files have no time, so they are read and printed as UTC.
const dateFormat = new Intl.DateTimeFormat(LOCALE.htmlLang, { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** The lightbox caption: "title · place · date", skipping what is missing. */
export const photoMeta = ({ data }: Photo) =>
  [data.title, data.location, dateFormat.format(data.date)].filter(Boolean).join(' · ');
