import api from '@/apis/index'

export const getOptionList = async (params) => {
  try {
    const response = await api.get('/v1/option', { params })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const registerOption = async (newOption) => {
  try {
    const response = await api.post('/v1/option', newOption)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const deleteOption = async (deleteOptionBody) => {
  try {
    const response = await api.post('/v1/option/delete-option', deleteOptionBody)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export default { getOptionList, registerOption, deleteOption }
