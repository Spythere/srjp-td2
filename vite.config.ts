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
        cleanupOutdatedCaches: true
      },
      devOptions: { enabled: false, suppressWarnings: true }
    })
  ],
  server: {
    port: 5345
  }
});
