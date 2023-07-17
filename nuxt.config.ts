import { description } from './package.json'

const title = 'Alumnirabatt'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
  ],
  app: {
    head: {
      title,
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: title,
      short_name: title,
      description,
      theme_color: '#E0EBE7',
      orientation: 'portrait',
      id: '/',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'  
        },
        {
          src: 'maskable-icon-x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: {
      enabled: false,
    },
  },
  tailwindcss: {
    config: {
      darkMode: 'class',
    },
  },
})
