<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

defineEmits(["update:modelValue", "save", "cancel"]);

const selection = defineModel("modelValue", { type: Object });

const togglePoop = () => {
  selection.value = { ...selection.value, poop: !selection.value.poop };
};

const togglePee = () => {
  selection.value = { ...selection.value, pee: !selection.value.pee };
};

const canSave = () => selection.value.poop || selection.value.pee;
</script>

<template>
  <div class="calm-card p-6 mb-8 soft-shadow">
    <h3 class="text-gray-700 font-semibold mb-4">What type?</h3>
    <div class="space-y-3">
      <button
        @click="togglePoop"
        :class="
          selection.poop
            ? 'bg-yellow-200'
            : 'bg-yellow-100 hover:bg-yellow-200'
        "
        class="w-full text-gray-700 font-medium py-3 rounded-lg transition"
      >
        💩 Poop {{ selection.poop ? "✓" : "" }}
      </button>
      <button
        @click="togglePee"
        :class="
          selection.pee ? 'bg-blue-200' : 'bg-blue-100 hover:bg-blue-200'
        "
        class="w-full text-gray-700 font-medium py-3 rounded-lg transition"
      >
        💧 Pee {{ selection.pee ? "✓" : "" }}
      </button>
      <div class="flex gap-2">
        <button
          @click="$emit('save')"
          :disabled="!canSave()"
          :class="canSave() ? 'btn-primary' : 'bg-gray-300'"
          class="flex-1 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          @click="$emit('cancel')"
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
