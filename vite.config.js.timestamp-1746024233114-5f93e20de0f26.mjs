// vite.config.js
import { defineConfig } from "file:///D:/Internship/headless/hydrogen-app/node_modules/vite/dist/node/index.js";
import { hydrogen } from "file:///D:/Internship/headless/hydrogen-app/node_modules/@shopify/hydrogen/dist/vite/plugin.js";
import { oxygen } from "file:///D:/Internship/headless/hydrogen-app/node_modules/@shopify/mini-oxygen/dist/vite/plugin.js";
import { vitePlugin as remix } from "file:///D:/Internship/headless/hydrogen-app/node_modules/@remix-run/dev/dist/index.js";
import tsconfigPaths from "file:///D:/Internship/headless/hydrogen-app/node_modules/vite-tsconfig-paths/dist/index.mjs";
import tailwindcss from "file:///D:/Internship/headless/hydrogen-app/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true
      }
    }),
    tsconfigPaths()
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    commonjsOptions: {
      transformMixedEsModules: true
      // Transpile CommonJS to ESM
    },
    assetsInlineLimit: 0
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ["react-slick", "slick-carousel"]
      // Pre-bundle these dependencies
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxJbnRlcm5zaGlwXFxcXGhlYWRsZXNzXFxcXGh5ZHJvZ2VuLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcSW50ZXJuc2hpcFxcXFxoZWFkbGVzc1xcXFxoeWRyb2dlbi1hcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0ludGVybnNoaXAvaGVhZGxlc3MvaHlkcm9nZW4tYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQge2h5ZHJvZ2VufSBmcm9tICdAc2hvcGlmeS9oeWRyb2dlbi92aXRlJztcclxuaW1wb3J0IHtveHlnZW59IGZyb20gJ0BzaG9waWZ5L21pbmktb3h5Z2VuL3ZpdGUnO1xyXG5pbXBvcnQge3ZpdGVQbHVnaW4gYXMgcmVtaXh9IGZyb20gJ0ByZW1peC1ydW4vZGV2JztcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICBoeWRyb2dlbigpLFxyXG4gICAgb3h5Z2VuKCksXHJcbiAgICByZW1peCh7XHJcbiAgICAgIHByZXNldHM6IFtoeWRyb2dlbi5wcmVzZXQoKV0sXHJcbiAgICAgIGZ1dHVyZToge1xyXG4gICAgICAgIHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxyXG4gICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxyXG4gICAgICAgIHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXHJcbiAgICAgICAgdjNfbGF6eVJvdXRlRGlzY292ZXJ5OiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICB0c2NvbmZpZ1BhdGhzKCksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgLy8gQWxsb3cgYSBzdHJpY3QgQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcclxuICAgIC8vIHdpdGh0b3V0IGlubGluaW5nIGFzc2V0cyBhcyBiYXNlNjQ6XHJcbiAgICBjb21tb25qc09wdGlvbnM6IHtcclxuICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWUsIC8vIFRyYW5zcGlsZSBDb21tb25KUyB0byBFU01cclxuICAgIH0sXHJcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMCxcclxuXHJcbiAgfSxcclxuICBzc3I6IHtcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICAvKipcclxuICAgICAgICogSW5jbHVkZSBkZXBlbmRlbmNpZXMgaGVyZSBpZiB0aGV5IHRocm93IENKUzw+RVNNIGVycm9ycy5cclxuICAgICAgICogRm9yIGV4YW1wbGUsIGZvciB0aGUgZm9sbG93aW5nIGVycm9yOlxyXG4gICAgICAgKlxyXG4gICAgICAgKiA+IFJlZmVyZW5jZUVycm9yOiBtb2R1bGUgaXMgbm90IGRlZmluZWRcclxuICAgICAgICogPiAgIGF0IC9Vc2Vycy8uLi4vbm9kZV9tb2R1bGVzL2V4YW1wbGUtZGVwL2luZGV4LmpzOjE6MVxyXG4gICAgICAgKlxyXG4gICAgICAgKiBJbmNsdWRlICdleGFtcGxlLWRlcCcgaW4gdGhlIGFycmF5IGJlbG93LlxyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvZGVwLW9wdGltaXphdGlvbi1vcHRpb25zXHJcbiAgICAgICAqL1xyXG4gICAgICBpbmNsdWRlOiBbJ3JlYWN0LXNsaWNrJywgJ3NsaWNrLWNhcm91c2VsJ10sIC8vIFByZS1idW5kbGUgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1TLFNBQVEsb0JBQW1CO0FBQzlULFNBQVEsZ0JBQWU7QUFDdkIsU0FBUSxjQUFhO0FBQ3JCLFNBQVEsY0FBYyxhQUFZO0FBQ2xDLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8saUJBQWlCO0FBRXhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFNBQVMsQ0FBQyxTQUFTLE9BQU8sQ0FBQztBQUFBLE1BQzNCLFFBQVE7QUFBQSxRQUNOLG1CQUFtQjtBQUFBLFFBQ25CLHNCQUFzQjtBQUFBLFFBQ3RCLHFCQUFxQjtBQUFBLFFBQ3JCLHVCQUF1QjtBQUFBLE1BQ3pCO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBO0FBQUEsSUFHTCxpQkFBaUI7QUFBQSxNQUNmLHlCQUF5QjtBQUFBO0FBQUEsSUFDM0I7QUFBQSxJQUNBLG1CQUFtQjtBQUFBLEVBRXJCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVdaLFNBQVMsQ0FBQyxlQUFlLGdCQUFnQjtBQUFBO0FBQUEsSUFDM0M7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
