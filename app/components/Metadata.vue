<script lang="ts" setup>
useHead({
  link: [
    {
      rel: 'icon',
      href: '/favicon.ico',
      sizes: 'any',
    },
    {
      rel: 'icon',
      href: '/favicon.svg',
      type: 'image/svg+xml',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
    },
  ],
})
</script>

<template>
  <VitePwaManifest />
</template>