<script lang="ts" setup>
useColorMode()
</script>

<template>
  <div class="flex justify-center items-start h-full">
    <Footer />
    <Metadata />
    <div class="w-full max-w-screen-md px-4 pb-12 md:pt-24 flex flex-col gap-4 md:pb-24 relative z-10 my-auto lg:my-0 flex-0">
      <Searchbox />
    </div>
  </div>
</template>

<style>
html {
  background-color: hsl(180, 20%, 95%);
  @apply transition-colors duration-1000 bg-auto;
}

body > div > div {
  @apply min-h-[100vh] py-4;
}

html.search-active {
  background-color: hsl(160, 20%, 90%);
}

html.dark {
  @apply text-white bg-gradient-to-tr from-gray-950 to-gray-800;
}
</style>