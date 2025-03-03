import { useState, useEffect } from 'react'
import { CFormSelect } from '@coreui/react'
import { getCategories } from '@/apis/product/categoryApis'

const AdminCategoryPicker = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([])
  const [mainCategories, setMainCategories] = useState([])
  const [middleCategories, setMiddleCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null) // 최종 선택된 카테고리 ID

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        setMainCategories(categoriesData.filter((cat) => cat.categoryLevel === 1))
      } catch (err) {
        console.error('카테고리 불러오기 오류:', err)
      }
    }
    fetchCategories()
  }, [])

  const handleMainChange = (e) => {
    const mainId = Number(e.target.value)
    setSelectedCategory(mainId)
    const middleCats = categories.filter(
      (cat) => cat.parentCategoryId === mainId && cat.categoryLevel === 2,
    )
    setMiddleCategories(middleCats)
    setSubCategories([])

    if (middleCats.length === 0) {
      // ✅ 중분류가 없으면 대분류가 최종 선택된 카테고리
      onCategoryChange(mainId)
    }
  }

  const handleMiddleChange = (e) => {
    const middleId = Number(e.target.value)
    setSelectedCategory(middleId)
    const subCats = categories.filter(
      (cat) => cat.parentCategoryId === middleId && cat.categoryLevel === 3,
    )
    setSubCategories(subCats)

    if (subCats.length === 0) {
      // ✅ 소분류가 없으면 중분류가 최종 선택된 카테고리
      onCategoryChange(middleId)
    }
  }

  const handleSubChange = (e) => {
    const subId = Number(e.target.value)
    setSelectedCategory(subId)
    onCategoryChange(subId) // ✅ 소분류 선택 시 최종 ID 저장
  }

  return (
    <div className="d-flex gap-4">
      {/* 대분류 */}
      <CFormSelect className="small-select" onChange={handleMainChange}>
        <option value="">대분류 선택</option>
        {mainCategories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.categoryName}
          </option>
        ))}
      </CFormSelect>

      {/* 중분류 */}
      <CFormSelect
        className="small-select"
        onChange={handleMiddleChange}
        disabled={middleCategories.length === 0}
      >
        <option value="">중분류 선택</option>
        {middleCategories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.categoryName}
          </option>
        ))}
      </CFormSelect>

      {/* 소분류 */}
      <CFormSelect
        className="small-select"
        onChange={handleSubChange}
        disabled={subCategories.length === 0}
      >
        <option value="">소분류 선택</option>
        {subCategories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.categoryName}
          </option>
        ))}
      </CFormSelect>
    </div>
  )
}

export default AdminCategoryPicker
