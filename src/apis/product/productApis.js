import { useApi } from '@/apis/index'
const api = useApi()

export const getProductList = async (conditions, params = { page: 0, size: 10 }) => {
  try {
    const response = await api.post('/product/v1/products/read', conditions, params)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getCategoryProductList = async (
  categoryId,
  conditions,
  params = { page: 0, size: 10 },
) => {
  try {
    const response = await api.post(`/public/v1/${categoryId}/products`, conditions, params)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getProductDetail = async (productId) => {
  try {
    const response = await api.get(`/public/v1/products/${productId}`)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const registerProduct = async (newProduct) => {
  try {
    const response = await api.post('/product/v1/products', newProduct)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const updateProduct = async (updateProduct) => {
  try {
    const response = await api.post('/product/v1/products/update-product', updateProduct)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

// 상품 삭제
export const deleteProduct = async (productId) => {
  try {
    console.log('🗑️ 상품 삭제 요청:', productId)
    const response = await api.delete(`/product/v1/products/${productId}`)
    console.log('✅ 상품 삭제 응답:', response)
    return response.data
  } catch (error) {
    console.error('❌ 상품 삭제 오류:', error)
    throw error
  }
}

// 여러 상품 일괄 삭제
export const deleteProducts = async (productIds) => {
  try {
    console.log('🗑️ 상품 일괄 삭제 요청:', productIds)
    const results = await Promise.allSettled(
      productIds.map((productId) => api.delete(`/product/v1/products/${productId}`)),
    )

    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    console.log(`✅ 삭제 완료: ${succeeded}개, ❌ 실패: ${failed}개`)

    if (failed > 0) {
      throw new Error(`${succeeded}개 삭제 성공, ${failed}개 실패`)
    }

    return { succeeded, failed, results }
  } catch (error) {
    console.error('❌ 상품 일괄 삭제 오류:', error)
    throw error
  }
}

export default {
  getProductList,
  getCategoryProductList,
  getProductDetail,
  registerProduct,
  updateProduct,
  deleteProduct,
  deleteProducts,
}
