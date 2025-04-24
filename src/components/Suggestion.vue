<template>
    <div class="suggestion-box" v-if="item">
      <h3>Suggestion:</h3>
      <p>
        <span v-if="item.state?.n === 0" class="reason-badge new">Start with:</span>
        <span v-else-if="item.state?.nextReviewDate && item.state.nextReviewDate <= Date.now()" class="reason-badge due">Time to review:</span>
        <span v-else class="reason-badge upcoming">Next up:</span>
  
        <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.name }}</a>!
      </p>
       <p class="reason" v-if="item.state?.n > 0 && item.state?.nextReviewDate">
          (Last practiced: {{ formatRelativeTime(item.state.lastPracticed) }} | Next review due: {{ new Date(item.state.nextReviewDate).toLocaleDateString() }})
       </p>
        <p class="reason" v-else-if="item.state?.n === 0">
          (Not practiced yet)
       </p>
    </div>
    <div class="suggestion-box" v-else>
      <h3>Suggestion:</h3>
      <p>All caught up for now, or add more resources!</p>
    </div>
  </template>
  
  <script setup>
  // Import the time utility function to use it in the template
  import { formatRelativeTime } from '../utils/time.js';
  
  defineProps({
    item: {
      type: Object, // Will be a resource object { id, name, link, state }
      default: null
    }
  });
  </script>
  
  
  <style scoped>
  .suggestion-box {
    background-color: #eef7ff;
    border: 1px solid #b3d7ff;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 25px;
    text-align: center;
  }
  
  .suggestion-box h3 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #0056b3;
  }
  
  .suggestion-box a {
    color: #0056b3;
    font-weight: bold;
    text-decoration: none;
    margin-left: 5px; /* Space after badge */
  }
  
  .suggestion-box a:hover {
      text-decoration: underline;
  }
  
  .reason {
      font-size: 0.85em;
      color: #555;
      margin-top: 5px;
  }
  
  .reason-badge {
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8em;
      margin-right: 5px;
      color: white;
  }
  .reason-badge.new {
      background-color: #17a2b8; /* Info color */
  }
  .reason-badge.due {
      background-color: #dc3545; /* Danger color */
  }
  .reason-badge.upcoming {
      background-color: #ffc107; /* Warning color */
      color: #333; /* Darker text for yellow */
  }
  
  </style>
  