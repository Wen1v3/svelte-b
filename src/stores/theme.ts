import { writable } from 'svelte/store';

// Define the type of your theme
export type Theme = 'light' | 'dark';

// Initialize with default theme (e.g., 'light')
const defaultTheme: Theme = 'light';

// Create the store
function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(defaultTheme);

  return {
    subscribe,
    toggle: () =>
      update((current) => (current === 'light' ? 'dark' : 'light')),
    setLight: () => set('light'),
    setDark: () => set('dark'),
  };
}

export const themeStore = createThemeStore();
