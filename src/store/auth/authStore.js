import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isEmpty } from 'es-toolkit/compat'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      userInfo: {}, // 사용자정보
      tokenInfo: 'aasdfasfd', // 사용자정보

      /* 로그인 완료후 사용자 정보 설정 */
      setUser: (data) => set({ userInfo: data }),

      /* 사용자 정보 초기화 - 로그아웃 시 */
      reset: () => {
        set({ userInfo: {} })
      },

      /* 로그인 여부 */
      isLogin: () => {
        return !isEmpty(get().userInfo)
      },

      /* 로그인 완료후 사용자 정보 설정 */
      setToken: (accessToken) => {
        set((state) => ({
          ...state,
          userInfo: {
            ...state.userInfo,
            accessToken,
          },
        }))
      },
    }),
    {
      name: 'product-store', // 스토리지의 키
      getStorage: () => sessionStorage, // 세션 스토리지 사용
    },
  ),
)
