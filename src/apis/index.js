import axios from 'axios'
import { useAuthStore } from '@/store/auth/authStore'

export function useApi() {
  // API 호출 함수 (공통 함수)
  const request = async (method, url, data = null, config = {}) => {
    const tokenInfo = useAuthStore((state) => state.tokenInfo)
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

    const headers = {
      ...config.headers,
      Authorization: tokenInfo ? `Bearer ${tokenInfo}` : '',
    }

    // responseType 설정
    const responseConfig = {
      headers,
      ...config,
    }

    try {
      const response =
        method === 'GET'
          ? await api.get(url, { params: data, ...responseConfig })
          : await api.post(url, data, ...responseConfig)

      return {
        status: response?.status,
        data: response?.data,
        header: response?.headers,
      }
    } catch (err) {
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
