import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import api from '@/apis/index'
import { isEmpty } from 'lodash'
import Cookies from 'react-cookies'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      userInfo: {
        accessToken: 'test1',
        refreshToken: 'test2',
      }, // 사용자정보
      referer: '', // 로그인완료후 이동할 페이지

      /* 로그인 완료후 사용자 정보 설정 */
      setUser: (data) => set({ userInfo: data }),

      /* 사용자 정보 초기화 - 로그아웃 시 */
      reset: () => {
        set({ userInfo: {} })
        set({ referer: '' })
      },

      /* 로그인 여부 */
      isLogin: () => {
        return !isEmpty(get().userInfo)
      },

      /* 로그인 완료후 사용자 정보 설정 */
      setToken: (accessToken, refreshToken) => {
        set((state) => ({
          ...state,
          userInfo: {
            ...state.userInfo,
            accessToken,
            refreshToken,
          },
        }))
      },

      /* 로그인 완료후 이동할 페이지 */
      setReferer: (param) => {
        Cookies.save('loginReferer', param, { maxAge: 30 })
      },
      getReferer: () => {
        return Cookies.load('loginReferer')
      },

      /* 토큰 만료시 재 로그인 + 현재 페이지 기록 */
      historyPage: (param) => {
        get().setReferer(param)
      },

      /* 신규토큰 요청 */
      requestToken: async () => {
        const codeVerifier = Cookies.get('codeVerifier')
        const url = `/v2/login?code=${new URLSearchParams(window.location.search).get('code')}&codeVerifier=${codeVerifier}`
        return await api.post(url, {})
      },
    }),
    {
      name: 'product-store', // 스토리지의 키
      getStorage: () => sessionStorage, // 세션 스토리지 사용
    },
  ),
)
