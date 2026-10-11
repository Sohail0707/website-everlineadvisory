// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://everlineadvisory.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Single-page site: inlining the (small) stylesheet removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  image: {
    // Keep generated images in the static build output (Netlify serves them from its CDN).
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  devToolbar: { enabled: false },
});
