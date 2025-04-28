import { useState, useEffect } from 'react'
import { CFormSelect } from '@coreui/react'
import { getCategories } from '@/apis/product/categoryApis'

const CategoryPicker = ({ onCategoryChange }) => {
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
    setSelectedCategory(mainId) // 대분류 선택 시 기본적으로 최종 선택된 카테고리로 설정
    const middleCats = categories.filter(
      (cat) => cat.parentCategoryId === mainId && cat.categoryLevel === 2,
    )
    setMiddleCategories(middleCats)
    setSubCategories([])

    // ✅ 중분류 선택 여부와 상관없이 현재 선택된 대분류를 기본으로 전달
    onCategoryChange(mainId)
  }

  const handleMiddleChange = (e) => {
    const value = e.target.value

    if (!value) {
      // 중분류 선택 해제 시
      setSubCategories([])
      const lastMainId = mainCategories.find((cat) =>
        middleCategories.some((mid) => mid.parentCategoryId === cat.categoryId),
      )?.categoryId

      if (lastMainId) {
        setSelectedCategory(lastMainId)
        onCategoryChange(lastMainId)
      }
      return
    }

    const middleId = Number(value)
    setSelectedCategory(middleId)
    const subCats = categories.filter(
      (cat) => cat.parentCategoryId === middleId && cat.categoryLevel === 3,
    )
    setSubCategories(subCats)
    onCategoryChange(middleId)
  }

  const handleSubChange = (e) => {
    const value = e.target.value

    if (!value) {
      // 소분류 선택 해제 시
      const lastMiddleId = middleCategories.find((cat) =>
        subCategories.some((sub) => sub.parentCategoryId === cat.categoryId),
      )?.categoryId

      if (lastMiddleId) {
        setSelectedCategory(lastMiddleId)
        onCategoryChange(lastMiddleId)
      }
      return
    }

    const subId = Number(value)
    setSelectedCategory(subId)
    onCategoryChange(subId)
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

export default CategoryPicker
