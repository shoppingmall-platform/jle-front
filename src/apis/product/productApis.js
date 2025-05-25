import { useApi } from '@/apis/index'
const api = useApi()

export const getProductList = async (conditions, params = { page: 0, size: 10 }) => {
  try {
    const response = await api.post('/product/v1/products/read', conditions, { params })
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
    const response = await api.post(`/product/v1/${categoryId}/products`, conditions, { params })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getProductDetail = async (productId) => {
  try {
    const response = await api.get(`/product/v1/products/${productId}`)
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

export default {
  getProductList,
  getCategoryProductList,
  getProductDetail,
  registerProduct,
  updateProduct,
}
