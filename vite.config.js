import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    outDir: 'dist', // Netlify expects output in /dist
    assetsInlineLimit: 0,
  },
  ssr: {
    target: 'node', // Required for Netlify Functions
  },
});