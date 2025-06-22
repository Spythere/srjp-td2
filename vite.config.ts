import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        disableDevLogs: true,
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,ico}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/stacjownik.spythere.eu\/api\/(getSceneries|getVehicles)/i,
            handler: 'NetworkFirst',
            options: {
              expiration: {
                maxAgeSeconds: 3600
              },
              cacheName: 'stacjownik-api-cache',
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      devOptions: { enabled: false, suppressWarnings: true }
    })
  ],
  server: {
    port: 5345
  }
});
