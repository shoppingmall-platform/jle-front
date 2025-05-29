import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isEmpty } from 'es-toolkit/compat'
import { useNavigate } from 'react-router-dom'
import { logout, refreshToken } from '@/apis/member/memberApis'

export const authStore = create(
  persist(
    (set, get) => ({
      userInfo: {}, // 사용자 정보
      tokenInfo: null, // 액세스 토큰

      // ✅ 사용자 정보 저장
      setUser: (data) => set({ userInfo: data }),

      // ✅ 토큰 저장
      setToken: (accessToken) => set({ tokenInfo: accessToken }),

      // ✅ 로그인 여부 판단
      isLogin: () => !isEmpty(get().userInfo) && !!get().tokenInfo,

      // ✅ 로그인 페이지 이동
      login: () => {
        const navigate = useNavigate()
        navigate('/login')
        // location.href = '/login'
      },

      // ✅ 로그아웃 처리
      logout: async () => {
        try {
          await logout()
        } catch (e) {
          console.error('Logout API error', e)
        } finally {
          set({ userInfo: {}, tokenInfo: null })
        }
      },

      // ✅ 토큰 재발급
      refreshToken: async () => {
        try {
          const response = await refreshToken()
          const newToken = response?.accessToken
          if (newToken) {
            get().setToken(newToken)
          } else {
            console.warn('토큰 없음 → 강제 로그아웃')
            get().logout()
          }
        } catch (e) {
          console.error('토큰 재발급 실패', e)
          get().logout()
        }
      },
    }),
    {
      name: 'auth-store',
      getStorage: () => sessionStorage,
      partialize: (state) => ({
        userInfo: state.userInfo,
        tokenInfo: state.tokenInfo,
      }),
    },
  ),
)
