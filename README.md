# Our Story

A handcrafted, cinematic landing page celebrating a romantic journey — elegant, emotional, and visually polished.

This project transforms a simple single-page site into a premium experience with careful typography, spacing, and subtle motion. It emphasizes photography, memories, and a personal love letter presented in a tactile UI.

**Key highlights**
- Cinematic hero slideshow with fade and parallax.
- Masonry moments gallery with lightbox preview and lazy-loading.
- Timeline section mapping important events to images.
- An animated envelope that reveals a love letter.
- Music section with album artwork and subtle animated progress.
- Motion-aware design: respects `prefers-reduced-motion` and saves motion on smaller devices.

**Tech stack**
- React (v19+)
- Vite
- TypeScript
- Tailwind CSS (utilities + some plain CSS fallbacks)
- motion (motion/react) for animations
- lucide-react for icons

**Project structure (important files)**
- `index.html`
- `src/App.tsx` — main app and components (Hero, Moments, LoveLetters, MusicSection)
- `src/utils/images.ts` — dynamic image loader using `import.meta.glob`
- `src/index.css` — theme helpers and CSS fallbacks
- `Pictures/` — place your images here (used throughout the site)

**Getting started (development)**

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the app in your browser (Vite will show the exact URL, typically `http://localhost:5173`).

**Environment**
- Optionally create a `.env.local` file at the repo root for host-specific values (for example, `APP_URL`). The site runs locally without special secrets.

**Images**
- Add photos to the `Pictures` folder. The app uses `src/utils/images.ts` to discover and map images automatically via `import.meta.glob`.
- Recommended: provide reasonably sized images (e.g., 1200–2400px on the long edge) and smaller variants (WebP/AVIF) for production builds. The UI uses lazy-loading and fade-in for performance.

**Developer notes & troubleshooting**
- If the editor reports missing React types, install the dev types:

```bash
npm i -D @types/react @types/react-dom
```

- The repo contains lightweight type shims in `src/global.d.ts` to improve editor UX when types are absent.
- Tailwind `@apply` rules are used in CSS. If your editor flags unknown at-rules, ensure Tailwind tooling is active, or use the provided plain-CSS fallbacks in `src/index.css`.
- Animations respect `prefers-reduced-motion` and device save-data. To reduce motion while developing, enable your OS/browser reduced-motion setting or resize the window under the mobile breakpoint.

**Build & deploy**

```bash
npm run build
npm run preview
```

For production, host the Vite build output (`dist/`) on any static host (Netlify/Vercel/GitHub Pages).

**Contributing**
- This project is personal and intended for small-scale or private use. For changes, open an issue or send a PR with focused improvements (image optimization, accessibility, or performance tuning).

**License & usage**
- Intended for personal use. See the site footer for attribution.

---