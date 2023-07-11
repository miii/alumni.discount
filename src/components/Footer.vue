<script lang="ts" setup>
import { version } from '../../package.json'
</script>

<template>
  <a
    href="https://www.github.com/miii"
    target="_blank"
    rel="noopener noreferrer"
    class="text-center text-xs opacity-30 fixed bottom-4 font-semibold flex gap-2 items-center hover:opacity-50"
  >
    <Icon name="logos:github-icon" class="scale-110" />
    Alumnirabatt v{{ version }}
  </a>
</template>