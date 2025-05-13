import axios from 'axios'
import { authStore } from '@/store/auth/authStore'

// 토큰 재발급 중복 방지를 위한 플래그
let isTokenRefreshing = false

export function useApi() {
  // API 호출 함수 (공통 함수)
  const request = async (method, url, data = null, config = {}) => {
    const { tokenInfo } = authStore.getState()
    // Axios 인스턴스 생성
    const api = axios.create({
      // baseURL: import.meta.env.VITE_API_URL,
      // baseURL: 'http://152.67.211.72:18080/product',
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokenInfo ? `Bearer ${tokenInfo}` : '',
      },
      timeout: 1800000, // 30분 타임아웃
    })

    // 헤더 및 context-type 설정
    api.interceptors.request.use(
      (config) => {
        // 요청이 전송되기 전에 헤더에 토큰 추가
        const tokenInfo = authStore.getState().tokenInfo
        config.headers['Authorization'] = tokenInfo ? `Bearer ${tokenInfo}` : ''
        return config
      },
      (error) => Promise.reject(error),
    )

    try {
      const response =
        method === 'GET'
          ? await api.get(url, { params: data, ...config })
          : await api.post(url, data, config)

      return {
        status: response?.status,
        data: response?.data,
        header: response?.headers,
      }
    } catch (err) {
      // 로그인 여부 체크
      if (err.response?.status === 400) {
        alert('시스템 오류입니다. \n관리자에게 문의바랍니다.')

        return
      } else if (err.response?.status === 401 && err.response?.data.error === 'TokenExpiredError') {
        // 이미 토큰 갱신 중이면 추가 처리하지 않음 (중복 처리 방지)
        if (!isTokenRefreshing) {
          isTokenRefreshing = true
          alert('인증이 만료되었습니다.')

          await authStore.getState().getTokenRefresh()

          setTimeout(() => {
            isTokenRefreshing = false // 페이지 새로고침 전에 플래그 초기화
          }, 1500)
        }

        return
      } else if (err.response?.status === 401) {
        alert('인증 정보가 유효하지 않습니다.', 'warn')

        authStore.getState().logout()

        setTimeout(() => {
          authStore.getState().login()
        }, 1500)

        return
      }

      return {
        status: err.response?.status,
        errorInfo: err.response?.data || {},
      }
    }
  }

  // API 호출 유틸 함수 제공
  const get = (url, params, config) => request('GET', url, params, config)
  const post = (url, params, config) => request('POST', url, params, config)

  return { get, post }
}
