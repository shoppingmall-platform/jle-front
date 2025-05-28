import axios from 'axios'
import { authStore } from '@/store/auth/authStore'

// 중복 요청 방지용 플래그
let isTokenRefreshing = false

export function useApi() {
  const request = async (method, url, data = null, config = {}) => {
    // ✅ Axios 인스턴스 생성 (쿠키 포함)
    const api = axios.create({
      baseURL: 'http://localhost:3000/api', // 환경변수로 바꾸는 게 이상적
      withCredentials: true, // ✅ 쿠키 인증을 위한 설정
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 1800000, // 30분
    })

    // ✅ 요청 인터셉터는 생략 가능 (Authorization 헤더 안 씀)
    // 필요시 로깅/추가 헤더는 유지 가능

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
      // ✅ 예외 처리
      const status = err.response?.status
      const errorCode = err.response?.data?.error

      if (status === 400) {
        alert('시스템 오류입니다.\n관리자에게 문의바랍니다.')
        return
      }

      if (status === 401 && errorCode === 'TokenExpiredError') {
        if (!isTokenRefreshing) {
          isTokenRefreshing = true
          alert('인증이 만료되었습니다.')

          try {
            await authStore.getState().refreshToken()
          } catch (e) {
            console.error('토큰 재발급 실패', e)
          }

          setTimeout(() => {
            isTokenRefreshing = false
          }, 1500)
        }

        return
      }

      if (status === 401) {
        alert('인증 정보가 유효하지 않습니다.')
        authStore.getState().logout()
        setTimeout(() => {
          authStore.getState().login()
        }, 1500)
        return
      }

      return {
        status: status,
        errorInfo: err.response?.data || {},
      }
    }
  }

  const get = (url, params, config) => request('GET', url, params, config)
  const post = (url, params, config) => request('POST', url, params, config)

  return { get, post }
}
