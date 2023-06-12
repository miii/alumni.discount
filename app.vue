<script lang="ts" setup>
const palette = ref<{ query: string }>()

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
        suffix: discount.description,
        href: discount.url,
        icon: 'i-heroicons-bolt-solid',
      }))
    }
  }].filter(Boolean)
})

function onSelect (option: any) {
  window.open(option.href, option.target)
}

const highlight = computed(() => palette.value && palette.value.query.length >= 2)
useHead({
  title: 'Alumnirabatt',
  bodyAttrs: {
    class: computed(() => highlight.value ? 'search-active' : '')
  }
})
</script>

<template>
  <div class="h-screen flex justify-center items-start">
    <div class="w-full max-w-screen-md px-4 pb-4 md:pt-24 md:pb-24">
      <UCommandPalette
        ref="palette"
        :groups="groups"
        @update:model-value="onSelect"
        placeholder="Sök bland butiker och rabatter..."
        :ui="{
          group: {
            command: {
              container: 'flex items-center gap-x-2 overflow-hidden py-0.5',
              label: 'flex flex-col overflow-hidden font-bold',
              prefix: 'text-xs opacity-50 font-semibold',
              suffix: 'text-xs opacity-50 font-semibold',
              icon: {
                base: 'flex-shrink-0 w-4 h-4 mx-2',
              },
            },
          },
        }"
        class="bg-white transition duration-1000"
        :class="highlight ? 'shadow-2xl' : 'shadow-md'"
      >
        <template #empty-state>
          <div />
        </template>
      </UCommandPalette>
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
</style>