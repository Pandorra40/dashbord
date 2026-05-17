export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  colorMode: { preference: 'dark' },
  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
  },
  compatibilityDate: '2025-01-15'
})
