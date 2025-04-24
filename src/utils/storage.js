const STORAGE_KEY = 'interviewPrepState';

/**
 * Loads the practice state from localStorage.
 * @returns {Record<string, {lastPracticed: number, n: number, nextReviewDate: number}>} The practice state object or an empty object if not found or invalid.
 */
export function loadPracticeState() {
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      // Basic validation: ensure it's an object
      if (typeof parsedState === 'object' && parsedState !== null) {
        return parsedState;
      }
    }
  } catch (error) {
    console.error("Failed to load or parse practice state from localStorage:", error);
    // Optionally clear invalid state: localStorage.removeItem(STORAGE_KEY);
  }
  return {}; // Return empty object if nothing stored, error occurred, or invalid format
}

/**
 * Saves the practice state to localStorage.
 * @param {Record<string, {lastPracticed: number, n: number, nextReviewDate: number}>} state The practice state object to save.
 */
export function savePracticeState(state) {
  try {
    const stateString = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, stateString);
  } catch (error) {
    console.error("Failed to save practice state to localStorage:", error);
  }
}
