import { useApi } from '@/apis/index'
const api = useApi()

/**
 * @returns 
 *  [
			{ categoryId: 1, parentCategoryId: null, categoryName: '대분류1', categoryLevel: 1 },
			{ categoryId: 2, parentCategoryId: 1, categoryName: '중분류1', categoryLevel: 2 },
			{ categoryId: 3, parentCategoryId: null, categoryName: '대분류2', categoryLevel: 1 },
			{ categoryId: 4, parentCategoryId: 3, categoryName: '중분류2', categoryLevel: 2 },
    ]
 */
export const getCategories = async () => {
  try {
    // http://localhost:8090/v1/categories
    const response = await api.get('/public/v1/categories')
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
    const response = await api.post('/product/v1/categories', newCategory)
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
export const updateCategory = async (updateCategory) => {
  try {
    const response = await api.post('/product/v1/categories/update-category', updateCategory)
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
export const deleteCategory = async (deleteCategoryId) => {
  try {
    const response = await api.post('/product/v1/categories/delete-category', deleteCategoryId)
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

export default { getCategories, createCategories, updateCategory, deleteCategory }
