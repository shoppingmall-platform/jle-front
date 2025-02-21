import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CCard,
  CCardBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
  CTable,
  CTableRow,
  CTableDataCell,
  CTableBody,
  CTableHead,
} from '@coreui/react'
import '../adminpage.css'
import { CIcon } from '@coreui/icons-react'
import { cilFolder, cilFolderOpen, cilDescription } from '@coreui/icons'

import {
  getCategories,
  createCategories,
  updateCategory,
  deleteCategory,
} from '@/apis/product/categoryApis'

const initialCategories = [
  { categoryId: 1, parentCategoryId: null, categoryName: '대분류1', categoryLevel: 1 },
  { categoryId: 2, parentCategoryId: 1, categoryName: '중분류1', categoryLevel: 2 },
  { categoryId: 3, parentCategoryId: null, categoryName: '대분류2', categoryLevel: 1 },
  { categoryId: 4, parentCategoryId: 3, categoryName: '중분류2', categoryLevel: 2 },
]

const ProductCategories = () => {
  const [categories, setCategories] = useState(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [addingSubcategory, setAddingSubcategory] = useState(false)
  const [newMainCategoryName, setNewMainCategoryName] = useState('')

  useEffect(() => {
    callGetCategoriesApi()
  }, [])

  async function callGetCategoriesApi() {
    try {
      const categories = await getCategories()
      setCategories(categories)
    } catch (err) {
      console.log(err)
      alert(err)
    }
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setEditCategoryName(category.categoryName)
    setAddingSubcategory(false)
  }

  const findParentCategoryName = (parentId) => {
    if (parentId === null) return '없음'
    const parentCategory = categories.find((cat) => cat.categoryId === parentId)
    return parentCategory ? parentCategory.categoryName : '없음'
  }

  const renderCategoryTree = (parentId = null) => {
    const childCategories = categories.filter((cat) => cat.parentCategoryId === parentId)
    if (childCategories.length === 0) return null
    return childCategories.map((cat) => (
      <CListGroup key={cat.categoryId}>
        <CListGroupItem
          component="button"
          style={{ border: 'none', gap: 5 }}
          onClick={() => handleCategoryClick(cat)}
        >
          <CIcon
            icon={
              cat.categoryLevel === 1
                ? cilFolder
                : cat.categoryLevel === 2
                  ? cilFolderOpen
                  : cilDescription
            }
          />
          {cat.categoryName}
        </CListGroupItem>
        {cat.categoryLevel < 3 && (
          <div style={{ paddingLeft: '20px' }}>{renderCategoryTree(cat.categoryId)}</div>
        )}
      </CListGroup>
    ))
  }

  const handleEditCategory = async () => {
    // 업데이트된 카테고리 정보
    const updatedCateory = {
      categoryId: selectedCategory.categoryId,
      parentCategoryId: selectedCategory.parentCategoryId,
      categoryName: editCategoryName,
      categoryLevel: selectedCategory.categoryLevel,
    }
    try {
      await updateCategory(updatedCateory)
    } catch (err) {
      console.error(err)
      alert(err)
    }

    // 업데이트 완료되었으니 업데이트된 카테고리 목록 재호출
    callGetCategoriesApi()
  }

  const handleDeleteCategory = async () => {
    // 선택된 카테고리 삭제
    const deleteCategoryId = {
      categoryId: selectedCategory.categoryId,
    }
    try {
      await deleteCategory(deleteCategoryId)
    } catch (err) {
      console.error(err)
      alert(err)
    }
    callGetCategoriesApi()

    // 새 카테고리명은 초기화
    setNewCategoryName('')

    setSelectedCategory(null)
  }

  const handleAddSubcategory = async () => {
    if (!newCategoryName) return
    const newSubCategory = {
      parentCategoryId: selectedCategory.categoryId,
      categoryName: newCategoryName,
      categoryLevel: selectedCategory.categoryLevel + 1,
    }
    try {
      await createCategories(newSubCategory)
    } catch (err) {
      console.error(err)
      alert(err)
    }
    callGetCategoriesApi()

    // 새 카테고리명은 초기화
    setNewCategoryName('')
    // 서브카테고리 토글 해제
    setAddingSubcategory(false)
  }

  const handleAddMainCategory = async () => {
    if (!newMainCategoryName) return
    const newCategory = {
      parentCategoryId: null,
      categoryName: newMainCategoryName,
      categoryLevel: 1,
    }

    try {
      await createCategories(newCategory)
    } catch (err) {
      console.error(err)
      alert(err)
    }
    callGetCategoriesApi()

    // 새 메인 카테고리명은 초기화
    setNewMainCategoryName('')
  }

  return (
    <CContainer fluid className="mb-4">
      <CRow className="my-4 justify-content-center">
        <h3>카테고리 관리</h3>
      </CRow>
      <CRow className="d-flex">
        <CCol xs={4} className="d-flex flex-column">
          <CCard className="flex-grow-1">
            <CCardHeader>카테고리 구조</CCardHeader>
            <CCardBody style={{ paddingLeft: '20px' }}>{renderCategoryTree()}</CCardBody>
          </CCard>
        </CCol>
        <CCol xs={8} className="d-flex flex-column">
          <CCard className="flex-grow-1">
            <CCardHeader>카테고리 수정 및 추가</CCardHeader>
            <CCardBody style={{ height: '300px', overflowY: 'auto' }}>
              {' '}
              {/* 카드의 높이를 고정 */}
              {selectedCategory ? (
                <div>
                  <h6>카테고리 정보</h6>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="text-center table-header">상위 카테고리명</td>
                        <td colSpan="4">
                          {findParentCategoryName(selectedCategory.parentCategoryId)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center table-header">카테고리명</td>
                        <td colSpan="4">
                          <CFormInput
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex gap-3">
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={handleEditCategory}
                      disabled={editCategoryName === selectedCategory.categoryName}
                    >
                      수정
                    </CButton>
                    <CButton color="danger" variant="outline" onClick={handleDeleteCategory}>
                      삭제
                    </CButton>

                    {!addingSubcategory && (
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => setAddingSubcategory(true)}
                      >
                        하위 카테고리 추가
                      </CButton>
                    )}
                  </div>
                  {addingSubcategory && (
                    <div style={{ marginTop: '10px' }}>
                      <CFormInput
                        size="sm"
                        placeholder="새 하위 카테고리명"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={handleAddSubcategory}
                        disabled={!newCategoryName.trim()}
                        style={{ marginTop: '10px' }}
                      >
                        추가
                      </CButton>
                    </div>
                  )}
                </div>
              ) : (
                <h6
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    marginTop: '50px',
                  }}
                >
                  카테고리를 선택하세요
                </h6>
              )}
            </CCardBody>
          </CCard>

          <CCard style={{ marginTop: '20px' }} className="flex-grow-1">
            <CCardHeader>대분류 추가</CCardHeader>
            <CCardBody>
              <CFormInput
                label="대분류 이름"
                size="sm"
                value={newMainCategoryName}
                onChange={(e) => setNewMainCategoryName(e.target.value)}
                style={{ width: '100%' }}
              />
              <CButton
                color="primary"
                variant="outline"
                onClick={handleAddMainCategory}
                style={{ marginTop: '10px' }}
              >
                추가
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductCategories
