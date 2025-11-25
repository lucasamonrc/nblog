const STORAGE_KEY = "babyLog";

export const loadEntries = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load entries:", e);
      return [];
    }
  }
  return [];
};

export const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};
