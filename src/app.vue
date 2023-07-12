<script lang="ts" setup>
useColorMode()
</script>

<template>
  <div class="h-screen flex justify-center items-start">
    <Footer />
    <Metadata />
    <div class="w-full max-w-screen-md px-4 pb-12 flex flex-col gap-4 md:pt-24 md:pb-24 relative z-10">
      <Searchbox />
    </div>
  </div>
</template>

<style>
body {
  background: hsl(180, 20%, 95%);
  @apply transition-colors duration-1000 py-4 h-full;
}

body.search-active {
  background: hsl(160, 20%, 90%);
}

html.dark body {
  @apply bg-gray-950 text-white;
}
</style>