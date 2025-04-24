/**
 * Formats a timestamp into a human-readable relative time string.
 * @param {number | null | undefined} timestamp - The timestamp in milliseconds since epoch.
 * @returns {string} Relative time string (e.g., "Never", "Today", "Yesterday", "X days ago").
 */
export function formatRelativeTime(timestamp) {
    if (!timestamp) {
      return 'Never';
    }
  
    const now = Date.now();
    const secondsPast = (now - timestamp) / 1000;
    const date = new Date(timestamp);
    const nowDate = new Date(now);
  
    // Set hours, minutes, seconds, and milliseconds to 0 for day comparison
    date.setHours(0, 0, 0, 0);
    nowDate.setHours(0, 0, 0, 0);
  
    const daysPast = (nowDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  
    if (daysPast === 0) {
      if (secondsPast < 60) {
          return `Just now`;
      }
      if (secondsPast < 3600) {
          const minutes = Math.floor(secondsPast / 60);
          return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
       if (secondsPast < 86400) { // Less than 24 hours
          const hours = Math.floor(secondsPast / 3600);
           return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      // Should technically be caught by daysPast === 0, but as fallback:
      return 'Today';
    }
    if (daysPast === 1) {
      return 'Yesterday';
    }
    if (daysPast < 7) {
      return `${daysPast} days ago`;
    }
    if (daysPast < 30) {
      const weeks = Math.floor(daysPast / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
     if (daysPast < 365) {
      const months = Math.floor(daysPast / 30); // Approximate
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  
    const years = Math.floor(daysPast / 365);
     return `${years} year${years > 1 ? 's' : ''} ago`;
  
    // Fallback for very old dates or potential calculation issues
    // return `On ${new Date(timestamp).toLocaleDateString()}`;
  }
  
  /**
   * Calculates the next review date based on the repetition count.
   * Uses exponential backoff (1, 2, 4, 8... days).
   * @param {number} n - The repetition number (1-based for the calculation).
   * @param {number} lastPracticedTimestamp - The timestamp of the last practice.
   * @returns {number} The timestamp for the next review date.
   */
  export function calculateNextReviewDate(n, lastPracticedTimestamp) {
    if (n <= 0) {
      // Should not happen if n is correctly initialized to 1 on first practice
      // Default to 1 day if something went wrong
      n = 1;
    }
    // Interval calculation: 2^(n-1) days
    const intervalDays = Math.pow(2, n - 1);
    const intervalMillis = intervalDays * 24 * 60 * 60 * 1000;
  
    return lastPracticedTimestamp + intervalMillis;
  }
  