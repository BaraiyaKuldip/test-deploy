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
      include: []
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxJbnRlcm5zaGlwXFxcXGhlYWRsZXNzXFxcXGh5ZHJvZ2VuLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcSW50ZXJuc2hpcFxcXFxoZWFkbGVzc1xcXFxoeWRyb2dlbi1hcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0ludGVybnNoaXAvaGVhZGxlc3MvaHlkcm9nZW4tYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQge2h5ZHJvZ2VufSBmcm9tICdAc2hvcGlmeS9oeWRyb2dlbi92aXRlJztcclxuaW1wb3J0IHtveHlnZW59IGZyb20gJ0BzaG9waWZ5L21pbmktb3h5Z2VuL3ZpdGUnO1xyXG5pbXBvcnQge3ZpdGVQbHVnaW4gYXMgcmVtaXh9IGZyb20gJ0ByZW1peC1ydW4vZGV2JztcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICBoeWRyb2dlbigpLFxyXG4gICAgb3h5Z2VuKCksXHJcbiAgICByZW1peCh7XHJcbiAgICAgIHByZXNldHM6IFtoeWRyb2dlbi5wcmVzZXQoKV0sXHJcbiAgICAgIGZ1dHVyZToge1xyXG4gICAgICAgIHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxyXG4gICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxyXG4gICAgICAgIHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXHJcbiAgICAgICAgdjNfbGF6eVJvdXRlRGlzY292ZXJ5OiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICB0c2NvbmZpZ1BhdGhzKCksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgLy8gQWxsb3cgYSBzdHJpY3QgQ29udGVudC1TZWN1cml0eS1Qb2xpY3lcclxuICAgIC8vIHdpdGh0b3V0IGlubGluaW5nIGFzc2V0cyBhcyBiYXNlNjQ6XHJcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogMCxcclxuICB9LFxyXG4gIHNzcjoge1xyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBJbmNsdWRlIGRlcGVuZGVuY2llcyBoZXJlIGlmIHRoZXkgdGhyb3cgQ0pTPD5FU00gZXJyb3JzLlxyXG4gICAgICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgZXJyb3I6XHJcbiAgICAgICAqXHJcbiAgICAgICAqID4gUmVmZXJlbmNlRXJyb3I6IG1vZHVsZSBpcyBub3QgZGVmaW5lZFxyXG4gICAgICAgKiA+ICAgYXQgL1VzZXJzLy4uLi9ub2RlX21vZHVsZXMvZXhhbXBsZS1kZXAvaW5kZXguanM6MToxXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEluY2x1ZGUgJ2V4YW1wbGUtZGVwJyBpbiB0aGUgYXJyYXkgYmVsb3cuXHJcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9kZXAtb3B0aW1pemF0aW9uLW9wdGlvbnNcclxuICAgICAgICovXHJcbiAgICAgIGluY2x1ZGU6IFtdLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtUyxTQUFRLG9CQUFtQjtBQUM5VCxTQUFRLGdCQUFlO0FBQ3ZCLFNBQVEsY0FBYTtBQUNyQixTQUFRLGNBQWMsYUFBWTtBQUNsQyxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGlCQUFpQjtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixTQUFTLENBQUMsU0FBUyxPQUFPLENBQUM7QUFBQSxNQUMzQixRQUFRO0FBQUEsUUFDTixtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxRQUNyQix1QkFBdUI7QUFBQSxNQUN6QjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQTtBQUFBLElBR0wsbUJBQW1CO0FBQUEsRUFDckI7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BV1osU0FBUyxDQUFDO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
