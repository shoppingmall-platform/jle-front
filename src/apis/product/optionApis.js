import { useApi } from '@/apis/index'
const api = useApi()

// 응답이 어떤 형태든 "배열"만 반환하도록 정규화
const normalizeOptionList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content // Spring pageable 흔함
  if (Array.isArray(data?.data)) return data.data // 감싸져 올 때
  if (Array.isArray(data?.items)) return data.items
  return []
}

export const getOptionList = async (params) => {
  try {
    const response = await api.get('/product/v1/options', { params }) // ✅ 핵심
    console.log('getOptionList response:', response)
    return normalizeOptionList(response.data) // ✅ 배열 보장
  } catch (error) {
    console.error('getOptionList error:', error)
    return [] // ✅ 절대 undefined 안 나가게
  }
}

export const registerOption = async (newOption) => {
  try {
    const response = await api.post('/product/v1/options', newOption)
    console.log('registerOption response:', response)
    return response.data
  } catch (error) {
    console.error('registerOption error:', error)
    throw error // 등록 실패는 호출부에서 처리하는 게 좋아
  }
}

export const deleteOption = async (deleteOptionBody) => {
  try {
    const response = await api.post('/product/v1/options/delete-option', deleteOptionBody)
    console.log('deleteOption response:', response)
    return response.data
  } catch (error) {
    console.error('deleteOption error:', error)
    throw error
  }
}

export default { getOptionList, registerOption, deleteOption }
