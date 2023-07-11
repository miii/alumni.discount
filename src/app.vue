<script lang="ts" setup>
import type { Discount } from './server/utils/search'

const palette = ref<any>()
const groups = computed(() => {
  return [{
    key: 'discounts',
    commands: [],
    search: async (q: string) => {
      if (!q || q.length < 2)
        return []

      const data = await $fetch(`/api/search`, { query: { q } })

      return data.results.map((discount) => ({
        id: discount.id,
        label: `${discount.brand}: ${discount.title}`,
        prefix: discount.provider,
        suffix: [discount.condition, discount.description].filter(Boolean).join(' - '),
        url: discount.url,
        icon: 'i-heroicons-bolt-solid',
      }))
    }
  }].filter(Boolean)
})

onMounted(() => palette.value?.$refs.comboboxInput.el.focus())
const onSelect = (option: Discount) => window.open(option.url, '_blank', 'noopener,noreferrer')
const highlightInput = computed(() => palette.value && palette.value.query.length >= 2)

useHead({
  bodyAttrs: {
    class: computed(() => highlightInput.value ? 'search-active' : '')
  },
})
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
  @apply transition-colors duration-1000 py-4;
}

body.search-active {
  background: hsl(160, 20%, 90%);
}

html.dark body {
  @apply bg-gradient-to-b from-black to-gray-800;
}
</style>