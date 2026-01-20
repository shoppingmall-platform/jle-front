import { useApi } from '@/apis/index'
const api = useApi()

export const getDiscountList = async (params) => {
  try {
    console.log('🔍 할인코드 조회 요청:', params)
    const response = await api.get('/product/v1/discounts', params)
    console.log('✅ 할인코드 조회 응답:', response)
    return response.data
  } catch (error) {
    console.error('❌ 할인코드 조회 실패:', error)
    throw error
  }
}

export const registerDiscount = async (newDiscount) => {
  try {
    console.log('➕ 할인코드 등록 요청:', newDiscount)
    const response = await api.post('/product/v1/discounts', newDiscount)
    console.log('✅ 할인코드 등록 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 할인코드 등록 실패:', error)
    throw error
  }
}

// export const deleteDiscount = async (deleteDiscountBody) => {
//   try {
//     console.log('🗑️ 할인코드 삭제 요청:', deleteDiscountBody)
//     const response = await api.post('/product/v1/discounts/delete-discount', deleteDiscountBody)
//     console.log('✅ 할인코드 삭제 성공:', response)
//     return response.data
//   } catch (error) {
//     console.error('❌ 할인코드 삭제 실패:', error)
//     throw error
//   }
// }

export const deleteDiscount = async (deleteDiscountBody) => {
  try {
    console.log('🗑️ 할인코드 삭제 요청:', deleteDiscountBody)

    // force가 true면 CASCADE 삭제 엔드포인트 사용
    const endpoint = deleteDiscountBody.force
      ? '/product/v1/discounts/force-delete'
      : '/product/v1/discounts/delete-discount'

    const response = await api.post(endpoint, deleteDiscountBody)
    console.log('✅ 할인코드 삭제 성공:', response)
    return response.data
  } catch (error) {
    console.error('❌ 할인코드 삭제 실패:', error)
    console.error('❌ 에러 상세:', error.response?.data)
    throw error
  }
}

export default { getDiscountList, registerDiscount, deleteDiscount }
