<script lang="ts" setup>
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/vue'
import { version } from '../../package.json'

/** Dummy model value for Combobox */
const selectedUrls = ref<string[]>([])
/** Search query */
const query = ref('')
/** Pending fetch state */
const pending = ref(false)

/** Minimum query length to trigger search */
const minQueryLength = computed(() => query.value.length > 2)
/** Whether any results has been fetched */
const initialState = ref(true)
/** Hightlight searchbox */
const highlight = ref(false)

const fetchedDiscounts = computedAsync(async () => {
  if (!minQueryLength.value)
    return null

  // Debounce search
  await new Promise(resolve => setTimeout(resolve, 100))

  // Fetch discounts from serverless function
  pending.value = true
  const data = await $fetch(`/api/search`, { query: { q: query.value } })
  pending.value = false
  initialState.value = false

  return data.results
}, null)

/** List of discounts */
const discounts = computed(() => {
  if (!minQueryLength.value)
    return []

  return fetchedDiscounts.value
})

/** Update hightlight state */
watch(query, () => highlight.value = true)

// Open links manually when selected with keyboard
watch(selectedUrls, urls => {
  const url = urls[0]
  if (!url)
    return

  // Combobox from HeadlessUI will add the selected item to the model value.
  // We don't need this, so we reset the model value to an empty array.
  selectedUrls.value = []

  // Open link in new tab
  window.open(url, '_blank', 'noopener,noreferrer')
})

// Make background darker when search is active
useHead(() => ({
  htmlAttrs: {
    class: [
      highlight.value ? 'search-active' : '',
    ],
    style: highlight.value ? '--searchbox-margin: 0; --searchbox-transition-duration: 0.3s' : undefined,
  },
}))

// Notify user when offline
const { isOnline } = useNetwork()

// Add dark mode support to logo serverless function
const colorMode = useColorMode()
</script>

<template>
  <Combobox v-model="selectedUrls" multiple>
    <div
      class="flex flex-col flex-1 min-h-0 divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800 transition dark:border border-gray-700"
      :class="highlight ? 'shadow-2xl duration-1000' : 'shadow-md duration-300'"
    >
      <div class="relative flex items-center">
        <Transition>
          <Icon v-if="initialState && !query.length" name="🫰" class="pointer-events-none absolute start-4 text-gray-400 dark:text-gray-500 h-3 w-3 dark:opacity-70" aria-hidden="true" />
          <Icon v-else name="heroicons:magnifying-glass" class="pointer-events-none absolute start-4 text-gray-400 dark:text-gray-500 h-4 w-4" aria-hidden="true" />
        </Transition>
        <Icon v-if="pending" name="line-md:loading-loop" class="pointer-events-none absolute end-4 text-gray-400 dark:text-gray-500 h-5 w-5" aria-hidden="true" />
        <ComboboxInput
          :value="query"
          autofocus
          placeholder="Sök bland butiker och erbjudanden..."
          class="w-full placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 text-gray-900 dark:text-white focus:ring-0 focus:outline-none sm:text-sm h-12 px-4 ps-11"
          @change="query = $event.target.value"
          @focus="highlight = true"
          @blur="highlight = false"
        />
      </div>
      <ComboboxOptions v-if="fetchedDiscounts" class="p-2 text-sm text-gray-700 dark:text-gray-200">
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
            class="flex gap-4 items-center rounded-md px-3 py-2 relative"
            :class="{ 'bg-gray-100 dark:bg-gray-900': active }"
            @click="$event.stopPropagation()"
          >
            <span
              class="w-12 border bg-white dark:border-transparent rounded dark:bg-gray-700"
              :class="{
                'shadow-md': active,
                'shadow': !active,
              }"
            >
              <span class="px-2 py-3 h-10 block">
                <img
                  :src="`/api/logo?src=${discount.logoUrl}&dark=${colorMode === 'dark'}&v=${version}`"
                  class="h-full object-cover object-left mx-auto"
                />
              </span>
            </span>
            <span class="flex flex-col overflow-hidden font-semibold w-full">
              <span class="text-xs opacity-60">
                <span>{{ discount.provider }}</span>
              </span>
              <span class="truncate flex-none font-bold">
                {{ discount.brand }}: {{ discount.title }}
              </span>
              <span class="truncate text-xs opacity-60">
                <span v-if="discount.condition" class="text-red-600 dark:text-red-300">{{ discount.condition }}.</span>
                {{ discount.description }}
              </span>
            </span>
          </a>
        </ComboboxOption>
        <div v-if="fetchedDiscounts?.length === 0">
          <div v-if="!isOnline" class="flex items-center justify-center h-12">
            <span class="text-gray-400 dark:text-gray-500">Du verkar vara offline</span>
          </div>
          <div v-else class="flex items-center justify-center h-12">
            <span class="text-gray-400 dark:text-gray-500">Inga resultat matchar <strong>"{{ query }}"</strong></span>
          </div>
        </div>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s linear, transform 0.1s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>