<script setup>
import ResourceItem from './ResourceItem.vue';

defineProps({
  items: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['practice', 'complete']);

function onItemPractice(resourceId) {
  emit('practice', resourceId);
}

function onItemComplete(resourceId) {
  emit('complete', resourceId);
}
</script>

<template>
  <ul class="resource-list">
    <ResourceItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @practice="onItemPractice"
      @complete="onItemComplete"
    />
  </ul>
</template>

<style scoped>
.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>