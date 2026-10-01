// The page is meant to be read without words: almost everything here is a label for
// assistive technology or metadata, not visible copy.
/** All interface copy. The photos live in src/content. */
interface Dictionary {
  meta: {
    home: { title: string; description: string };
  };
  /** The one word shown at the top of the page. */
  title: string;
  skip: string;
  theme: string;
  lightbox: { label: string; close: string; previous: string; next: string };
  footer: { top: string };
  notFound: { title: string; body: string; home: string };
}

export const ui: Dictionary = {
  meta: {
    home: {
      title: 'Gallery — 1nicoan',
      description: 'Fotos de Nicolás Andrade.',
    },
  },
  title: 'Gallery',
  skip: 'Saltar al contenido',
  theme: 'Cambiar tema',
  lightbox: { label: 'Foto ampliada', close: 'Cerrar', previous: 'Anterior', next: 'Siguiente' },
  footer: { top: 'Volver arriba' },
  notFound: { title: 'Página no encontrada', body: 'Esta página no existe.', home: 'Ir al inicio' },
};
