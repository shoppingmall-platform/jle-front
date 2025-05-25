import { useApi } from '@/apis/index'
const api = useApi()

export const getDiscountList = async (params) => {
  try {
    const response = await api.get('/product/v1/discounts', params)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const registerDiscount = async (newDiscount) => {
  try {
    const response = await api.post('/product/v1/discounts', newDiscount)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const deleteDiscount = async (deleteDiscountBody) => {
  try {
    // URL : /delete-discount로 수정 필요
    const response = await api.post('/product/v1/discounts/delete-discount', deleteDiscountBody)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export default { getDiscountList, registerDiscount, deleteDiscount }
