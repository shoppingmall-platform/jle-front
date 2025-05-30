import { useApi } from '@/apis/index'
const api = useApi()

export const getMyAddresses = async () => {
  try {
    const response = await api.get('/member/v1/address')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const updateAddress = async (updateAddressInfo) => {
  try {
    const response = await api.post('/member/v1/update-address', updateAddressInfo)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const deleteAddress = async (addressId) => {
  try {
    const response = await api.post('/member/v1/delete-address', { addressId })
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const registerAddress = async (newAddressInfo) => {
  try {
    const response = await api.post('/member/v1/address', newAddressInfo)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export default {
  getMyAddresses,
  updateAddress,
  deleteAddress,
  registerAddress,
}
