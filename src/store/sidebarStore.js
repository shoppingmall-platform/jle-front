// store/sidebarStore.js
import { create } from 'zustand'

const useSidebarStore = create((set) => ({
  sidebarShow: true, // Sidebar가 보이는지 여부
  unfoldable: false, // Sidebar 확장 가능 여부
  setSidebarShow: (visible) => set({ sidebarShow: visible }),
  toggleUnfoldable: () => set((state) => ({ unfoldable: !state.unfoldable })),
}))

export default useSidebarStore
