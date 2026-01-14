import { useApi } from '@/apis/index'
const api = useApi()

export const login = async (loginId, password) => {
  try {
    const response = await api.post('/token/login', { loginId, password })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await api.get('/token/logout')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const refreshToken = async () => {
  try {
    const response = await api.post('/token/auth/refresh')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getMemberInfo = async () => {
  try {
    const response = await api.get('/member/v1/members/me')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const registerMember = async (newMemberInfo) => {
  try {
    const response = await api.post('/public/v1/members', newMemberInfo)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateMember = async (updateMemberInfo) => {
  try {
    const response = await api.post('/member/v1/members/me/update', updateMemberInfo)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const changePassword = async (memberId, oldPassword, newPassword) => {
  try {
    const requestBody = {
      oldPassword,
      newPassword,
    }
    console.log('🔐 비밀번호 변경 API 요청')
    console.log('   헤더 X-MEMBER-ID:', memberId)
    console.log('   Body:', requestBody)

    const response = await api.post('/member/v1/members/me/update/auth', requestBody, {
      headers: {
        'X-MEMBER-ID': memberId,
      },
    })
    console.log('✅ 비밀번호 변경 API 응답:', response)
    return response.data
  } catch (error) {
    console.error('❌ 비밀번호 변경 API 에러:', error)
    console.error('❌ 에러 응답:', error.response?.data)
    console.error('❌ 에러 상태:', error.response?.status)
    throw error
  }
}

export const withdrawMember = async () => {
  try {
    const response = await api.post('/member/v1/members/me/withdraw')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 관리자용: 회원 검색/조회
export const searchMember = async (conditions, params = { page: 0, size: 10 }) => {
  try {
    console.log('🔍 회원 검색 요청:', { conditions, params })
    const response = await api.post('/member/v1/members/search', conditions, { params })
    console.log('✅ 회원 검색 응답:', response)
    return response.data
  } catch (error) {
    console.error('❌ 회원 검색 오류:', error)
    console.error('❌ 에러 응답:', error.response?.data)
    throw error
  }
}

export default {
  login,
  logout,
  refreshToken,
  getMemberInfo,
  updateMember,
  registerMember,
  changePassword,
  withdrawMember,
  searchMember,
}
