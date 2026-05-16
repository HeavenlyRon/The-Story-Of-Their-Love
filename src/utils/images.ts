// Dynamic image loader using Vite's glob import
// Exports arrays of photos that the app can use for hero, gallery, timeline, etc.

type Photo = { src: string; name: string; id: string };

// Import all images from the Pictures folder at build time.
// Include common image formats and nested folders. Use eager import so Vite returns URLs.
const modules = (import.meta as any).glob('../../Pictures/**/*.{jpg,jpeg,png,webp,gif,avif,svg}', { eager: true }) as Record<string, any>;

function basename(path: string) {
  // normalize windows/backslash and posix
  return path.replace(/.*[\\\/]/, '');
}

function idFromName(name: string) {
  return name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

const photos: Photo[] = Object.keys(modules)
  .map((p) => {
    const mod = modules[p];
    const src = mod && (mod.default ?? mod) as string;
    const name = basename(p);
    return { src, name, id: idFromName(name) } as Photo;
  })
  .filter((ph) => !!ph.src)
  .sort((a, b) => a.name.localeCompare(b.name));

export const heroPhotos = photos.slice(0, Math.min(6, photos.length));
export const galleryPhotos = photos.slice();
export default photos;
