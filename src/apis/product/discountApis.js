import api from '@/apis/index'

export const getDiscountList = async (startDate, endDate, discountName = '') => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      discountName, // 선택값
    }
    const response = await api.get('product/v1/discounts/getDiscountList', { params })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const registerDiscount = async (newDiscount) => {
  try {
    const response = await api.post('/product/v1/discounts/registerDiscount', newDiscount)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const deleteDiscount = async (deleteDiscount) => {
  try {
    const response = await api.post('/product/v1/discounts/deleteDiscount', deleteDiscount)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export default { getDiscountList, registerDiscount, deleteDiscount }
