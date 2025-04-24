<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'; // Added onMounted
import ResourceList from './components/ResourceList.vue';
import Suggestion from './components/Suggestion.vue';
import { loadPracticeState, savePracticeState } from './utils/storage';
import { calculateNextReviewDate } from './utils/time.js'; // Assuming you don't need formatRelativeTime directly in App.vue


// --- Hardcoded Resources ---
// Add your actual resources here
const resources = reactive([
  { id: 'lc', name: 'LeetCode Problems', link: 'https://leetcode.com/problemset/all/' },
  { id: 'tensor-p', name: 'Tensor Puzzlers', link: 'https://colab.research.google.com/drive/1v7sfmic8RGTQbcocK2gYkMk5MppUnuMA#scrollTo=e3f8a5ae'},
  { id: 'transformer-p', name: 'Transformer Puzzlers', link: 'https://colab.research.google.com/drive/1viInHSAj2c8ZSilmnkHrxBZN9IoS-Edb' },
  { id: 'deep-ml', name: 'Deep ML', link: 'https://www.deep-ml.com/' },
  { id: 'transformers-scratch', name: 'Transformers from Scratch', link: 'https://e2eml.school/transformers.html' },
  { id: 'token-sampling', name: 'Intro to Token Sampling', link: 'https://colab.research.google.com/drive/1pgNriL94PTFS58eSk8YT4K5ZO6ybIrwx' },
  { id: 'ml-interviews', name: 'Intro to ML Interviews', link: 'https://huyenchip.com/ml-interviews-book/' },
  { id: 'transformer-interp', name: 'Transformer Interpretability', link: 'https://arena-chapter1-transformer-interp.streamlit.app/' },
    

  // { id: 'ctci', name: 'Cracking the Coding Interview Book', link: 'https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850' },
  // { id: 'sysDesign', name: 'System Design Primer (GitHub)', link: 'https://github.com/donnemartin/system-design-primer' },
  // { id: 'algoExpert', name: 'AlgoExpert', link: 'https://www.algoexpert.io' },
  // { id: 'behavioral', name: 'Behavioral Questions Prep', link: 'https://haseebq.com/my-preparation-process-for-facebook/' }
  // Add more resources as needed...
]);

// --- State Management (Placeholder - will be implemented next) ---
// This will hold data like { lc: { lastPracticed: ..., n: ..., nextReviewDate: ... }, ... }
const practiceState = ref({}); // Will be loaded from localStorage

// --- Computed Properties for Sorting & Suggestion (Placeholders) ---
// --- Computed Properties (Implement fully now) ---

// Combine resources with their state for sorting/display
const resourcesWithState = computed(() => {
  return resources.map(r => {
    const state = practiceState.value[r.id] || { lastPracticed: null, n: 0, nextReviewDate: null };
    return {
      ...r, // Spread resource props (id, name, link)
      state // Add state object (lastPracticed, n, nextReviewDate)
    };
  });
});

// Sort the combined resources
const sortedResourcesWithState = computed(() => {
  const now = Date.now();
  return [...resourcesWithState.value].sort((a, b) => {
    const stateA = a.state;
    const stateB = b.state;

    // 1. Never practiced items go last
    if (stateA.n === 0 && stateB.n > 0) return 1; // a goes after b
    if (stateA.n > 0 && stateB.n === 0) return -1; // a goes before b
    if (stateA.n === 0 && stateB.n === 0) return 0; // Keep original order if both unpracticed

    // 2. Both practiced: Sort by nextReviewDate (ascending)
    const nextReviewA = stateA.nextReviewDate || 0;
    const nextReviewB = stateB.nextReviewDate || 0;

    return nextReviewA - nextReviewB; // Earlier date comes first
  });
});


// Determine the next suggestion
const suggestion = computed(() => {
  const now = Date.now();
  let suggestionPool = [...resourcesWithState.value]; // Use combined data

  // Filter for items that are due (next review date is past or today)
  let dueItems = suggestionPool.filter(item => item.state.n > 0 && item.state.nextReviewDate && item.state.nextReviewDate <= now);

  if (dueItems.length > 0) {
    // If items are due, suggest the one with the earliest nextReviewDate
    dueItems.sort((a, b) => (a.state.nextReviewDate || 0) - (b.state.nextReviewDate || 0));
    return dueItems[0];
  }

  // If no items are due, check for unpracticed items
  let unpracticedItems = suggestionPool.filter(item => item.state.n === 0);
  if (unpracticedItems.length > 0) {
    // Suggest the first unpracticed item from the original list order
    // Find the first resource from `resources` that is in `unpracticedItems`
    const firstUnpracticedId = resources.find(r => unpracticedItems.some(u => u.id === r.id))?.id;
    return suggestionPool.find(item => item.id === firstUnpracticedId) || null; // Return the full item object
  }

  // If all items practiced and none are due, suggest the one with the overall earliest next review date
  let practicedItems = suggestionPool.filter(item => item.state.n > 0);
  if (practicedItems.length > 0) {
     practicedItems.sort((a, b) => (a.state.nextReviewDate || 0) - (b.state.nextReviewDate || 0));
     return practicedItems[0];
  }

  // Fallback: No items available
  return null;
});

// --- Methods (Placeholder) ---
function handlePractice(resourceId) {
  console.log(`Marking resource ${resourceId} as practiced`);
  const now = Date.now();
  const currentState = practiceState.value[resourceId] || { n: 0 }; // Get current state or default

  // Increment repetition count
  const newN = currentState.n + 1;

  // Calculate next review date using the new repetition count
  const nextReviewDate = calculateNextReviewDate(newN, now);

  // Update the state for this resource
  // Use Vue.set or direct assignment since practiceState is a ref
  practiceState.value = {
      ...practiceState.value, // Keep existing state for other items
      [resourceId]: {
          lastPracticed: now,
          n: newN,
          nextReviewDate: nextReviewDate
      }
  };

  console.log(`Updated state for ${resourceId}:`, practiceState.value[resourceId]);
}
// --- Load initial state & Watch for changes (Placeholder) ---
onMounted(() => {
  practiceState.value = loadPracticeState();
});

watch(practiceState, (newState) => {
  savePracticeState(newState);
}, { deep: true });

</script>

<template>
  <div class="app-container">
    <h1>Interview Prep Tracker</h1>

    <Suggestion :item="suggestion" />

    <h2>Resources</h2>
    <ResourceList
      :items="sortedResourcesWithState"
      @practice="handlePractice"
    />

    <footer>
      <p>Keep up the great work!</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  font-family: sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1, h2 {
  color: #333;
  text-align: center;
  margin-bottom: 1.5em;
}

footer {
  margin-top: 30px;
  text-align: center;
  font-size: 0.9em;
  color: #777;
}
</style>