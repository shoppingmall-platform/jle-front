import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCategoryStore = create(
  persist(
    (set) => ({
      selectedCategory: null,

      selectCategory: (selected) => {
        console.log('selected', selected)
        set({ selectedCategory: selected })
      },
    }),
    {
      name: 'category-storage',
      getStorage: () => localStorage,
    },
  ),
)
