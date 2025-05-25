import { useApi } from '@/apis/index'
const api = useApi()

export const login = async (loginId, password) => {
  try {
    const response = await api.post('/token/login', { loginId, password })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const logout = async () => {
  try {
    const response = await api.get('/token/logout')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const checkToken = async () => {
  try {
    const response = await api.get('/token/auth/check-token')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const refreshToken = async () => {
  try {
    const response = await api.post('/token/auth/refresh')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getMemberInfo = async () => {
  try {
    const response = await api.get('/member/v1/members/me')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const registerMember = async (newMemberInfo) => {
  try {
    const response = await api.post('/member/v1/members', newMemberInfo)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const updateMember = async (updateMemberInfo) => {
  try {
    const response = await api.post('/member/v1/members/me/update', updateMemberInfo)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const changePassword = async (newPassword) => {
  try {
    const response = await api.post('/member/v1/members/me/update/auth', { newPassword })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const withdrawMember = async () => {
  try {
    const response = await api.post('/member/v1/members/me/withdraw')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export default {
  login,
  logout,
  checkToken,
  refreshToken,
  getMemberInfo,
  updateMember,
  registerMember,
  changePassword,
  withdrawMember,
}
