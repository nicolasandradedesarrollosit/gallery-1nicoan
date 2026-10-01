/** Scroll-linked behaviour: elements fade in as they enter the viewport. */
import { reducedMotion } from '../loader';

let observer: IntersectionObserver | undefined;

function initReveal() {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.classList.add('reveal');
    observer?.observe(el);
  });
}

export function initScroll() {
  observer?.disconnect();
  if (!reducedMotion() && 'IntersectionObserver' in window) initReveal();
}
