<script lang="ts" setup>
useColorMode()
</script>

<template>
  <div class="flex justify-center items-start h-full">
    <Footer />
    <Metadata />
    <div id="container"
      class="w-full max-w-screen-md px-4 pb-12 md:pt-12 md:pb-24 flex flex-col gap-4 relative z-10 flex-0">
      <Searchbox />
    </div>
  </div>
</template>

<style>
html {
  background-color: hsl(180, 20%, 95%);
  @apply transition-colors duration-1000 bg-auto;
}

body>div>div {
  @apply min-h-[100svh] py-4;
}

html.search-active {
  background-color: hsl(160, 20%, 90%);

  .container {
    @apply my-0;
  }
}

#container {
  margin-top: var(--searchbox-margin, 40vh);
  transition: margin ease-out;
  transition-duration: var(--searchbox-transition-duration, 0.5s);
}

html.dark {
  @apply text-white bg-gradient-to-tr from-gray-950 to-gray-800;
}
</style>