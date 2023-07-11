<script lang="ts" setup>
import { version } from '../../package.json'
</script>

<template>
  <a
    href="https://www.github.com/miii"
    target="_blank"
    rel="noopener noreferrer"
    class="text-center text-xs opacity-20 fixed bottom-4 font-semibold flex gap-2 items-center hover:opacity-40"
  >
    <GithubLogo class="w-4" />
    Alumnirabatt v{{ version }}
  </a>
</template>