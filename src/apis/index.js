import axios from 'axios'
import { useAuthStore } from '@/store/auth/authStore'

// Axios 인스턴스 생성
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  // baseURL: 'http://152.67.211.72:18080/product',
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1800000, // 30분 타임아웃
})

// // 요청 인터셉터: 자동으로 토큰 추가
// api.interceptors.request.use(
//   (config) => {
//     const authStore = useAuthStore.getState() // Zustand 스토어 직접 접근
//     if (authStore.userInfo.accessToken) {
//       config.headers['Access-Token'] = authStore.userInfo.accessToken
//     }
//     if (authStore.userInfo.refreshToken) {
//       config.headers['Refresh-Token'] = authStore.userInfo.refreshToken
//     }
//     config.headers['Access-Control-Allow-Credentials'] = false
//     return config
//   },
//   (error) => Promise.reject(error),
// )

// // 응답 인터셉터: 토큰 갱신 및 오류 처리
// api.interceptors.response.use(
//   (response) => {
//     // 로그인된 경우 새로운 토큰 저장
//     const authStore = useAuthStore.getState()
//     if (authStore.isLogin()) {
//       authStore.setToken(response.headers['access-token'], response.headers['refresh-token'])
//     }
//     return response
//   },
//   (error) => {
//     const authStore = useAuthStore.getState()

//     console.error('API Error:', error)

//     if (!authStore.isLogin()) {
//       authStore.login()
//       return Promise.reject(error)
//     }

//     if (error.response?.status === 401 && error.response.data?.errCode === 'AUTH005') {
//       // 만료된 토큰 처리
//       setTimeout(() => {
//         authStore.login()
//       }, 500)
//     }

//     // 기타 오류 메시지 처리
//     if (error.response?.status !== 200) {
//       const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
//       let errMsg = korean.test(error.response?.data?.errMsg)
//         ? error.response?.data?.errMsg
//         : '시스템 오류입니다.'

//       if (error.response?.status === 403) {
//         errMsg = '권한이 없습니다.'
//       } else if (error.response?.status === 500) {
//         errMsg = error?.message
//       } else {
//         errMsg = error?.message
//       }

//       console.error('Error Message:', errMsg)
//     }

//     return Promise.reject(error)
//   },
// )

// API 호출 함수 (공통 함수)
const request = async (method, url, data = null, config = {}) => {
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
    return {
      status: err.response?.status,
      errorInfo: err.response?.data || {},
    }
  }
}

// API 호출 유틸 함수 제공
export const get = (url, params, config) => request('GET', url, params, config)
export const post = (url, params, config) => request('POST', url, params, config)

export default api
