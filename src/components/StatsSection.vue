<script setup>
defineProps({
  feedingCount: Number,
  poopCount: Number,
  peeCount: Number,
});
</script>

<template>
  <div class="mb-8">
    <div class="text-xs text-gray-500 mb-3 uppercase tracking-wide">
      Last 24 hours
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div class="calm-card p-4 text-center soft-shadow">
        <div class="text-2xl font-light text-green-600 mb-1">
          {{ feedingCount }}
        </div>
        <div class="text-xs text-gray-600">Feedings</div>
      </div>
      <div class="calm-card p-4 text-center soft-shadow">
        <div class="text-2xl font-light text-yellow-600 mb-1">
          {{ poopCount }}
        </div>
        <div class="text-xs text-gray-600">Poops</div>
      </div>
      <div class="calm-card p-4 text-center soft-shadow">
        <div class="text-2xl font-light text-blue-600 mb-1">
          {{ peeCount }}
        </div>
        <div class="text-xs text-gray-600">Pees</div>
      </div>
    </div>
  </div>
</template>
