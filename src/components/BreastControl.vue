<script setup>
const props = defineProps({
  side: {
    type: String,
    required: true, // "left" or "right"
  },
  isActive: Boolean,
  duration: Number,
  minutes: Number,
});

defineEmits(["start", "end"]);

const colorClass = {
  left: {
    badge: "text-orange-600 bg-orange-50",
    button:
      "bg-linear-to-r from-orange-400 to-orange-500 hover:shadow-lg",
  },
  right: {
    badge: "text-blue-600 bg-blue-50",
    button:
      "bg-linear-to-r from-blue-400 to-blue-500 hover:shadow-lg",
  },
}[
  props.side
];

const label = props.side.charAt(0).toUpperCase() + props.side.slice(1) + " Breast";
</script>

<template>
  <div class="breast-section">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-2xl">👶</span>
        <span class="font-semibold text-gray-700">{{ label }}</span>
      </div>
      <div
        v-if="isActive"
        :class="colorClass.badge"
        class="text-sm font-medium px-3 py-1 rounded"
      >
        {{ duration }}s
      </div>
    </div>
    <div class="flex gap-2">
      <button
        v-if="!isActive"
        @click="$emit('start')"
        class="btn-primary text-white font-semibold py-3 px-4 rounded-lg transition flex-1"
      >
        Start
      </button>
      <button
        v-else
        @click="$emit('end')"
        :class="colorClass.button"
        class="text-white font-semibold py-3 px-4 rounded-lg transition flex-1 soft-shadow"
      >
        End
      </button>
      <div
        class="text-center py-3 px-4 bg-white rounded-lg border border-gray-200 font-medium text-gray-700 min-w-24"
      >
        {{ minutes || 0 }}m
      </div>
    </div>
  </div>
</template>

<style scoped>
.breast-section {
  padding: 16px;
  border-radius: 12px;
  background: #f9f7ff;
  border: 1px solid rgba(200, 220, 230, 0.5);
}
</style>
