import axios from 'axios'
import { authStore } from '@/store/auth/authStore'

// 중복 요청 방지용 플래그
let isTokenRefreshing = false

export function useApi() {
  const request = async (method, url, data = null, config = {}) => {
    // ✅ Axios 인스턴스 생성 (쿠키 포함)
    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ 환경변수로 baseURL 설정
      withCredentials: true, // ✅ 쿠키 인증을 위한 설정
      headers: {
        'Content-Type': 'application/json',
        ROLE: 'ADMIN', // TODO: 현재 프론트에서 강제로 어드민 권한을 부여하는데 백엔드에서 토큰 기반으로 부여할 수 있게 수정 필요요
      },
      timeout: 1800000, // 30분
    })

    // ✅ 요청 인터셉터는 생략 가능 (Authorization 헤더 안 씀)
    // 필요시 로깅/추가 헤더는 유지 가능

    try {
      const response =
        method === 'GET'
          ? await api.get(url, { params: data, ...config })
          : method === 'DELETE'
            ? await api.delete(url, { data, ...config })
            : method === 'PUT'
              ? await api.put(url, data, config)
              : method === 'PATCH'
                ? await api.patch(url, data, config)
                : await api.post(url, data, config)

      return {
        status: response?.status,
        data: response?.data,
        header: response?.headers,
      }
    } catch (err) {
      // ✅ 예외 처리
      const status = err.response?.status
      const message = err.response?.data?.message

      if (status === 400) {
        alert('시스템 오류입니다.\n관리자에게 문의바랍니다.')
        return {
          status: status,
          errorInfo: err.response?.data || {},
        }
      }

      if (status === 401 && message === 'expired') {
        if (!isTokenRefreshing) {
          isTokenRefreshing = true

          try {
            await authStore.getState().refreshToken()
            isTokenRefreshing = false

            // ✅ 토큰 재발급에 성공했으면 요청 재시도
            return await request(method, url, data, config)
          } catch (e) {
            console.error('토큰 재발급 실패', e)
            isTokenRefreshing = false
            authStore.getState().logout()
            authStore.getState().login()
            return {
              status: 401,
              errorInfo: { message: 'Token refresh failed' },
            }
          }
        } else {
          // ✅ 다른 요청이 토큰을 갱신 중이면 1초 대기 후 재시도
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return await request(method, url, data, config)
        }
      }

      if (status === 401) {
        alert('인증 정보가 유효하지 않습니다.')
        authStore.getState().logout()
        setTimeout(() => {
          authStore.getState().login()
        }, 1500)
        return {
          status: status,
          errorInfo: err.response?.data || {},
        }
      }

      return {
        status: status,
        errorInfo: err.response?.data || {},
      }
    }
  }

  const get = (url, params, config) => request('GET', url, params, config)
  const post = (url, params, config) => request('POST', url, params, config)
  const del = (url, params, config) => request('DELETE', url, params, config)
  const put = (url, params, config) => request('PUT', url, params, config)
  const patch = (url, params, config) => request('PATCH', url, params, config)

  return { get, post, delete: del, put, patch }
}
