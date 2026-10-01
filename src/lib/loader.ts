/** Client-side control of the page curtain (src/components/layout/PageLoader.astro). */

/** Time for the curtain to cover the page before anything changes behind it. */
const COVER_MS = 450;
/** How long the curtain stays once the change behind it is done. */
const HOLD_MS = 350;

const root = document.documentElement;

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function hideLoader() {
  delete root.dataset.loading;
}

/** Raises the curtain, runs `action` once the page is covered, then lifts it. */
export function withLoader(action: () => void) {
  if (reducedMotion()) return action();
  root.dataset.loading = 'out';
  setTimeout(() => {
    action();
    setTimeout(hideLoader, HOLD_MS);
  }, COVER_MS);
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Settles when the image has loaded; a broken one must not hold the page forever. */
const loaded = (image: HTMLImageElement) =>
  image.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
      });

/**
 * First load: the head script in BaseLayout raises the curtain before first paint;
 * it lifts here once every photo of the page is in.
 */
export async function liftWhenLoaded() {
  if (!root.dataset.loading) return;
  await Promise.all([wait(COVER_MS), ...Array.from(document.images, loaded)]);
  setTimeout(hideLoader, HOLD_MS);
}
