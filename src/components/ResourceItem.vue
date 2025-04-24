<script setup>
import { computed } from 'vue';
// Import the utility function
import { formatRelativeTime } from '../utils/time.js';

const props = defineProps({
  item: {
    type: Object, // Contains { id, name, link, state: { lastPracticed, n, nextReviewDate } }
    required: true
  }
});

const emit = defineEmits(['practice']);

function markPracticed() {
  emit('practice', props.item.id);
}

// Use the utility function for display
const lastPracticedDisplay = computed(() => {
  return formatRelativeTime(props.item.state?.lastPracticed);
});

// Optional: Format next review date for display/debug
const nextReviewDisplay = computed(() => {
    const nextDate = props.item.state?.nextReviewDate;
    if (!nextDate) return 'N/A';
    return new Date(nextDate).toLocaleDateString(); // Simple date format
})

</script>

<template>
  <li class="resource-item">
    <div class="info">
      <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.name }}</a>
      <span class="last-practiced">Last practiced: {{ lastPracticedDisplay }}</span>
       <span class="debug-info">
         (Rep: {{ item.state?.n || 0 }})
         <span v-if="item.state?.n > 0"> | Next review: {{ nextReviewDisplay }}</span>
       </span>
    </div>
    <button @click="markPracticed" class="practice-button">
      Mark Practiced Today
    </button>
  </li>
</template>

<style scoped>
/* Styles remain the same */
.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  transition: background-color 0.2s ease;
}

.resource-item:hover {
  background-color: #f0f0f0;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.info a:hover {
  text-decoration: underline;
}

.last-practiced {
  font-size: 0.85em;
  color: #555;
}

.debug-info {
    font-size: 0.75em;
    color: #6c757d; /* Bootstrap's text-muted color */
}

.practice-button {
  padding: 8px 12px;
  font-size: 0.9em;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap; /* Prevent button text wrapping */
  margin-left: 10px; /* Add some space between info and button */
}

.practice-button:hover {
  background-color: #218838;
}
</style>
