<script setup>
import BreastControl from "./BreastControl.vue";

defineProps({
  leftBreastActive: Boolean,
  rightBreastActive: Boolean,
  leftBreastDuration: Number,
  rightBreastDuration: Number,
  leftBreastMinutes: Number,
  rightBreastMinutes: Number,
});

defineEmits(["end-session", "start-breast", "end-breast"]);
</script>

<template>
  <div class="calm-card p-6 soft-shadow mb-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-gray-700">🍼 Feeding Session</h2>
      <button
        @click="$emit('end-session')"
        class="bg-linear-to-r from-red-400 to-red-500 text-white font-semibold py-2 px-4 rounded-lg soft-shadow transition hover:shadow-lg"
      >
        End Session
      </button>
    </div>

    <BreastControl
      side="left"
      :is-active="leftBreastActive"
      :duration="leftBreastDuration"
      :minutes="leftBreastMinutes"
      @start="$emit('start-breast', 'left')"
      @end="$emit('end-breast', 'left')"
      class="mb-4"
    />

    <BreastControl
      side="right"
      :is-active="rightBreastActive"
      :duration="rightBreastDuration"
      :minutes="rightBreastMinutes"
      @start="$emit('start-breast', 'right')"
      @end="$emit('end-breast', 'right')"
    />
  </div>
</template>
