// store/appStore.js
import { create } from 'zustand'

const useThemeStore = create((set) => ({
  sidebarShow: true, // Sidebar visibility
  theme: 'light', // Default theme
  setSidebarShow: (visible) => set({ sidebarShow: visible }),
  setTheme: (theme) => set({ theme }), // Function to update theme
}))

export default useThemeStore
