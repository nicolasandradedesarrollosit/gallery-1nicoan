/**
 * Client entry point, loaded once from BaseLayout. The router swaps the page without
 * reloading, so clicks are handled by delegation on `document` and everything that
 * touches specific elements is re-run on `astro:page-load`.
 */
import { closeLightbox, initLightbox, openLightbox, stepLightbox } from './lightbox';
import { liftWhenLoaded, withLoader } from './loader';
import { initScroll } from './motion/scroll';

const root = document.documentElement;

function toggleTheme() {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  withLoader(() => {
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage unavailable: the choice just lasts for this page view.
    }
  });
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const hit = (selector: string) => target.closest<HTMLElement>(selector);
  let el: HTMLElement | null;

  if (hit('[data-theme-toggle]')) toggleTheme();
  else if ((el = hit('[data-photo]'))) openLightbox(el);
  else if (hit('[data-lightbox-prev]')) stepLightbox(-1);
  else if (hit('[data-lightbox-next]')) stepLightbox(1);
  // The close button, or the empty area around the photo (not the photo itself).
  else if (hit('[data-lightbox-close]') || target.hasAttribute('data-lightbox-backdrop')) closeLightbox();
});

document.addEventListener('astro:page-load', () => {
  initScroll();
  initLightbox();
});

// Module scripts run after the document is parsed, so every <img> is already there.
liftWhenLoaded();
