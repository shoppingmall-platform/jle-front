import { useApi } from '@/apis/index'
import api from '@/apis/indexTest'

export const test = async () => {
  const api = useApi()
  try {
    const response = await api.get('/v1/st/user/apis')
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

export const testCustom = async () => {
  try {
    const response = await api.get('/v1/st/user/apis')
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}
