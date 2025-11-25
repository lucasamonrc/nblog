<script setup>
defineProps({
  modelValue: Boolean,
  feedingData: {
    type: Object,
    required: true,
  },
});

defineEmits(["update:modelValue", "save"]);

const isOpen = defineModel("modelValue", { type: Boolean });

const totalMinutes = () => {
  return (feedingData.leftBreast || 0) + (feedingData.rightBreast || 0);
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="isOpen = false">
    <div class="modal-content" @click.stop>
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Edit Feeding</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Left Breast (minutes)</label
          >
          <input
            v-model.number="feedingData.leftBreast"
            type="number"
            min="0"
            placeholder="0"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Right Breast (minutes)</label
          >
          <input
            v-model.number="feedingData.rightBreast"
            type="number"
            min="0"
            placeholder="0"
          />
        </div>

        <div class="bg-blue-50 p-3 rounded-lg text-sm text-gray-700">
          <strong>Total:</strong> {{ totalMinutes() }} minutes
        </div>

        <div class="flex gap-3 pt-4">
          <button
            @click="$emit('save')"
            class="btn-primary text-white font-semibold py-2 px-4 rounded-lg flex-1 transition"
          >
            Save
          </button>
          <button
            @click="isOpen = false"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex-1 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
