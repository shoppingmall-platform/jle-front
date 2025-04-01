import api from '@/apis/index'

export const getProductList = async (params = { page: 0, size: 10 }) => {
  try {
    const response = await api.get('/product/v1/products', { params })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getCategoryProductList = async (categoryId, params = { page: 0, size: 10 }) => {
  try {
    const response = await api.get(`/product/v1/${categoryId}/products`, { params })
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
