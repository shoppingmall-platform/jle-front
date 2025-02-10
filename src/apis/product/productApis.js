import { useApi } from '@/apis/index'

const api = useApi()


/**
 * @returns 
 *  [
        { categoryId: 1, categoryParent: null, categoryName: '대분류1', categoryDepth: 1 },
        { categoryId: 2, categoryParent: 1, categoryName: '중분류1', categoryDepth: 2 },
        { categoryId: 3, categoryParent: null, categoryName: '대분류2', categoryDepth: 1 },
        { categoryId: 4, categoryParent: 3, categoryName: '중분류2', categoryDepth: 2 },
    ]
 */
export const fetchCategories = async () => {
  try {
    const response = await api.get('/v1/categories')
    console.log(response)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
