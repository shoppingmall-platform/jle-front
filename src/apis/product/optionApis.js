import { useApi } from '@/apis/index'
const api = useApi()

export const getOptionList = async (params) => {
  try {
    const response = await api.get('/product/v1/options', params)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const registerOption = async (newOption) => {
  try {
    const response = await api.post('/product/v1/options', newOption)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const deleteOption = async (deleteOptionBody) => {
  try {
    const response = await api.post('/product/v1/options/delete-option', deleteOptionBody)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export default { getOptionList, registerOption, deleteOption }
