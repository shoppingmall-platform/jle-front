<<<<<<< HEAD
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { useApi } from '@/apis'
import { isEmpty } from 'lodash'
import Cookies from 'react-cookies'
=======
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useApi } from "@/apis";
import { isEmpty } from "lodash";
import Cookies from "react-cookies";
>>>>>>> 3b627244605618b40f5e856c57c1c6edcfa6f019

export const useAuthStore = create(
  persist(
    (set, get) => ({
      userInfo: {
<<<<<<< HEAD
        accessToken: 'test1',
        refreshToken: 'test2',
      }, // 사용자정보
      referer: '', // 로그인완료후 이동할 페이지
=======
        accessToken: "test1",
        refreshToken: "test2",
      }, // 사용자정보
      referer: "", // 로그인완료후 이동할 페이지
>>>>>>> 3b627244605618b40f5e856c57c1c6edcfa6f019

      /* 로그인 완료후 사용자 정보 설정 */
      setUser: (data) => set({ userInfo: data }),

      /* 사용자 정보 초기화 - 로그아웃 시 */
      reset: () => {
<<<<<<< HEAD
        set({ userInfo: {} })
        set({ referer: '' })
=======
        set({ userInfo: {} });
        set({ referer: "" });
>>>>>>> 3b627244605618b40f5e856c57c1c6edcfa6f019
      },

      /* 로그인 여부 */
      isLogin: () => {
<<<<<<< HEAD
        return !isEmpty(get().userInfo)
=======
        return !isEmpty(get().userInfo);
>>>>>>> 3b627244605618b40f5e856c57c1c6edcfa6f019
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
<<<<<<< HEAD
        }))
=======
        }));
>>>>>>> 3b627244605618b40f5e856c57c1c6edcfa6f019
      },

      /* 로그인 완료후 이동할 페이지 */
      setReferer: (param) => {
<<<<<<< HEAD
        Cookies.save('loginReferer', param, { maxAge: 30 })
      },
      getReferer: () => {
        return Cookies.load('loginReferer')
=======
        Cookies.save("loginReferer", param, { maxAge: 30 });
      },
      getReferer: () => {
        return Cookies.load("loginReferer");
>>>>>>> 3b627244605618b40f5e856c57c1c6edcfa6f019
      },

      /* 토큰 만료시 재 로그인 + 현재 페이지 기록 */
      historyPage: (param) => {
<<<<<<< HEAD
        get().setReferer(param)
=======
        get().setReferer(param);
>>>>>>> 3b627244605618b40f5e856c57c1c6edcfa6f019
      },

      /* 신규토큰 요청 */
      requestToken: async () => {
<<<<<<< HEAD
        const api = useApi()
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
=======
        const api = useApi();
        const codeVerifier = Cookies.get("codeVerifier");
        const url = `/v2/login?code=${new URLSearchParams(window.location.search).get("code")}&codeVerifier=${codeVerifier}`;
        return await api.post(url, {});
      },
    }),
    {
      name: "product-store", // 스토리지의 키
      getStorage: () => sessionStorage, // 세션 스토리지 사용
    }
  )
);
>>>>>>> 3b627244605618b40f5e856c57c1c6edcfa6f019
