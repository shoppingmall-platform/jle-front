import { useApi } from '@/apis/index'

const api = useApi()


/**
 * @returns 
 *  [
			{ categoryId: 1, categoryParent: null, categoryName: '대분류1', categoryLevel: 1 },
			{ categoryId: 2, categoryParent: 1, categoryName: '중분류1', categoryLevel: 2 },
			{ categoryId: 3, categoryParent: null, categoryName: '대분류2', categoryLevel: 1 },
			{ categoryId: 4, categoryParent: 3, categoryName: '중분류2', categoryLevel: 2 },
    ]
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/v1/categories')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}


/**
 * @returns 
 *  { categoryId: 1 }
 */
export const createCategories = async (newCategory) => {
  try {
    const response = await api.post('/v1/categories', newCategory)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}


/**
 * @returns 
 *  "update successful"
 */
export const updateCategories = async (categoryId, updateCategory) => {
  try {
    const response = await api.post(`/v1/categories/update-category/${categoryId}`, updateCategory)
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
  

/**
 * @returns 
 * 
 */
export const deleteCategories = async (categoryId) => {
  try {
    const response = await api.post(`/v1/categories/delete-category/${categoryId}`)
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}
  