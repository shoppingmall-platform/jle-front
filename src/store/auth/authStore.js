import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isEmpty } from 'es-toolkit/compat'

export const authStore = create(
  persist(
    (set, get) => ({
      userInfo: {}, // 사용자정보
      tokenInfo: 'aasdfasfd', // 사용자정보

      /* 로그인 완료후 사용자 정보 설정 */
      setUser: (data) => set({ userInfo: data }),

      /* 로그인 여부 */
      isLogin: () => {
        return !isEmpty(get().userInfo)
      },

      /* 로그인 */
      login: () => {
        /* TODO: 로그인 페이지로 라우팅 */
        // router.push('/login')
        // location.href='/login';
      },

      /* 사용자 정보 초기화 - 로그아웃 시 */
      logout: () => {
        /* TODO: 로그아웃 api 호출 필요 */

        set({ userInfo: {} })
        set({ tokenInfo: null })
      },

      /* 로그인 완료후 사용자 정보 설정 */
      setToken: (accessToken) => {
        set((state) => ({
          ...state,
          tokenInfo: accessToken,
        }))
      },

      /* 토큰 재발급 요청 */
      getTokenRefresh: async () => {
        /* TODO: 토큰 재발급 요청 api 추가 */
        // const response = await getRefreshToken();

        if (response?.accessToken) {
          setToken(response?.accessToken)
        } else {
          return
        }
      },
    }),
    {
      name: 'product-store', // 스토리지의 키
      getStorage: () => sessionStorage, // 세션 스토리지 사용
    },
  ),
)
