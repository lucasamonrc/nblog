<script setup>
import { formatTime, formatDuration } from "../utils/formatting.js";

const props = defineProps({
  entries: {
    type: Array,
    required: true,
  },
  originalEntries: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["edit-feeding", "remove-entry"]);

const getOriginalIndex = (entry) => {
  return props.originalEntries.findIndex(
    (e) => e === entry || (e.startTime === entry.startTime && e.type === entry.type)
  );
};
</script>

<template>
  <div class="calm-card p-6 soft-shadow">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div
         v-for="(entry, index) in entries"
         :key="index"
         class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group cursor-pointer"
         @click="entry.type === 'feeding' ? emit('edit-feeding', getOriginalIndex(entry)) : null"
       >
        <div v-if="entry.type === 'feeding'" class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <span class="text-2xl">🍼</span>
            <div class="flex-1">
              <div class="font-medium text-gray-700">
                {{ formatDuration(entry.leftBreast + entry.rightBreast) }}
              </div>
              <div class="text-xs text-gray-500">
                {{ formatTime(entry.startTime) }} · L: {{ formatDuration(entry.leftBreast) }} | R: {{ formatDuration(entry.rightBreast) }}
              </div>
            </div>
          </div>
          <button
             @click.stop="emit('remove-entry', getOriginalIndex(entry))"
             class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
             title="Delete entry"
           >
             ✕
           </button>
        </div>
        <div v-else class="flex items-center justify-between">
          <div class="flex items-center gap-3 flex-1">
            <span class="text-2xl">
              {{
                entry.poop && entry.pee
                  ? "💩💧"
                  : entry.poop
                    ? "💩"
                    : "💧"
              }}
            </span>
            <div class="flex-1">
              <div class="font-medium text-gray-700">
                {{
                  entry.poop && entry.pee
                    ? "Poop & Pee"
                    : entry.poop
                      ? "Poop"
                      : "Pee"
                }}
              </div>
              <div class="text-sm text-gray-500">
                {{ formatTime(entry.timestamp) }}
              </div>
            </div>
          </div>
          <button
             @click.stop="emit('remove-entry', getOriginalIndex(entry))"
             class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
             title="Delete entry"
           >
             ✕
           </button>
          </div>
          </div>
          </div>
          </div>
          </template>
