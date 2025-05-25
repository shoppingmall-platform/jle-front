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
export const getTags = async () => {
  try {
    // http://localhost:8090/v1/categories
    const response = await api.get('/product/v1/products/tags')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export default { getTags }
