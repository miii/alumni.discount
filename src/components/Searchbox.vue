<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/vue'

const selectedUrls = ref<string[]>([])
const query = ref('')
const pending = ref(true)

const minQueryLength = computed(() => query.value.length > 2)
const previousCount = ref<number>(1)
const highlight = ref(false)

const discounts = computedAsync(async () => {
  if (!minQueryLength.value)
    return []

  pending.value = true
  const data = await $fetch(`/api/search`, { query: { q: query.value } })
  pending.value = false
  previousCount.value = data.results.length

  return data.results
}, [])

const updateHightlight = () => highlight.value = query.value.length > 0
watch(query, updateHightlight)

watch(selectedUrls, urls => {
  const url = urls[0]
  if (!url)
    return

  window.open(url, '_blank', 'noopener,noreferrer')
  selectedUrls.value = []
})

useHead({
  bodyAttrs: {
    class: computed(() => highlight.value ? 'search-active' : '')
  },
})
</script>

<template>
  <Combobox v-model="selectedUrls" multiple>
    <div
      class="flex flex-col flex-1 min-h-0 divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900 transition"
      :class="highlight ? 'shadow-2xl duration-1000' : 'shadow-md duration-300'"
    >
      <div class="relative flex items-center">
        <Icon name="heroicons:magnifying-glass" class="pointer-events-none absolute start-4 text-gray-400 dark:text-gray-500 h-4 w-4" aria-hidden="true" />
        <ComboboxInput
          :value="query"
          autofocus
          placeholder="Sök bland butiker och erbjudanden..."
          class="w-full placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none sm:text-sm h-12 px-4 ps-10"
          @change="query = $event.target.value"
          @focus="updateHightlight"
          @blur="highlight = false"
        />
      </div>
      <ComboboxOptions v-if="minQueryLength" class="p-2 text-sm text-gray-700 dark:text-gray-200">
        <ComboboxOption
          v-for="discount in discounts"
          :key="discount.id"
          :value="discount.url"
          v-slot="{ active }"
          title="Gå till erbjudande"
          class="cursor-pointer"
        >
          <a
            :href="discount.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex gap-4 items-center rounded-md px-2 py-1.5 relative"
            :class="{ 'bg-gray-100': active }"
            @click="$event.stopPropagation()"
          >
            <span class="w-12 border shadow bg-white" :class="{ 'shadow-md': active }">
              <span class="px-2 py-3 h-10 block">
                <img :src="`/api/logo?src=${discount.logoUrl}`" class="h-full object-cover object-left mx-auto" />
              </span>
            </span>
            <span class="flex flex-col overflow-hidden font-semibold w-full">
              <span class="text-xs opacity-50">
                <span>{{ discount.provider }}</span>
              </span>
              <span class="truncate flex-none font-bold">
                {{ discount.brand }}: {{ discount.title }}
              </span>
              <span class="truncate text-xs opacity-50">
                <span v-if="discount.condition" class="text-red-700">{{ discount.condition }}.</span>
                {{ discount.description }}
              </span>
            </span>
          </a>
        </ComboboxOption>
        <div v-if="discounts.length === 0 && previousCount === 0">
          <div class="flex items-center justify-center h-12">
            <span class="text-gray-400 dark:text-gray-500">Inga resultat matchar <strong>"{{ query }}"</strong></span>
          </div>
        </div>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>