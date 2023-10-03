<script lang="ts" setup>
import { version } from '../../package.json'

// Remove trailing .0 from version
const shortVersion = version.replace(/\.0$/, '')
</script>

<template>
  <a href="https://www.github.com/miii" target="_blank" rel="noopener noreferrer"
    class="text-center text-xs opacity-20 fixed bottom-6 font-semibold flex gap-2 items-center hover:opacity-40 transition-opacity">
    <GithubLogo class="w-4" />
  </a>
</template>