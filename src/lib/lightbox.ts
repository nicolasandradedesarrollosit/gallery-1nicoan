/**
 * Lightbox (src/components/gallery/Lightbox.astro). Everything it shows is read from
 * the data attributes of the grid tiles, so this only opens, moves and closes.
 */

const dialog = () => document.querySelector<HTMLDialogElement>('[data-lightbox]');
const tiles = () => Array.from(document.querySelectorAll<HTMLElement>('[data-photo]'));

let current = 0;

function show(index: number) {
  const box = dialog();
  const all = tiles();
  if (!box || !all.length) return;
  current = (index + all.length) % all.length;
  const { full, alt = '', meta = '', number = '', ratio = '1' } = all[current].dataset;

  const image = box.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const placeholder = box.querySelector<HTMLElement>('[data-lightbox-placeholder]');
  if (image) {
    image.hidden = !full;
    // Dropped first so the previous photo never shows while the next one loads.
    image.removeAttribute('src');
    if (full) image.src = full;
    image.alt = alt;
  }
  if (placeholder) {
    placeholder.hidden = Boolean(full);
    placeholder.style.setProperty('--ratio', ratio);
    const label = placeholder.querySelector('[data-lightbox-number]');
    if (label) label.textContent = number;
  }

  const set = (selector: string, text: string) => {
    const el = box.querySelector(selector);
    if (el) el.textContent = text;
  };
  set('[data-lightbox-count]', `${number} / ${String(all.length).padStart(2, '0')}`);
  set('[data-lightbox-meta]', meta);
}

export function openLightbox(tile: HTMLElement) {
  const box = dialog();
  if (!box) return;
  show(tiles().indexOf(tile));
  if (box.open) return;
  box.showModal();
  // The dialog itself takes the focus, so no control is ringed on open.
  box.focus();
}

export const stepLightbox = (delta: number) => show(current + delta);

export const closeLightbox = () => dialog()?.close();

/** Runs on every page load: the dialog element is new after a navigation. */
export function initLightbox() {
  // Covers Esc too: focus goes back to the photo that was last on screen.
  dialog()?.addEventListener('close', () => tiles()[current]?.focus());
}

document.addEventListener('keydown', (event) => {
  if (!dialog()?.open) return;
  if (event.key === 'ArrowLeft') stepLightbox(-1);
  else if (event.key === 'ArrowRight') stepLightbox(1);
});
