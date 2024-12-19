import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProductStore = create(
  persist(
    (set, get) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),

      decrement: (data) => {
        console.log('methods', data)
        set((state) => ({
          count: state.count - 1,
        }))
      },

      returns: (data) => {
        console.log('returns')
        const returnsData = state.count + 1
        return returnsData
      },
    }),
    {
      name: 'product-store', // 스토리지의 키
      getStorage: () => sessionStorage, // 세션 스토리지 사용
    },
  ),
)
