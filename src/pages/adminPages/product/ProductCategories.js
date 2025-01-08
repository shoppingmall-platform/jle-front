import React, { useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CTable,
  CTableRow,
  CTableDataCell,
  CTableBody,
  CTableHead,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilFolder, cilFolderOpen, cilDescription } from '@coreui/icons'
import { CListGroup, CListGroupItem } from '@coreui/react'

const initialCategories = [
  { categoryId: 1, categoryParent: null, categoryName: '대분류1', categoryDepth: 1 },
  { categoryId: 2, categoryParent: 1, categoryName: '중분류1', categoryDepth: 2 },
  { categoryId: 3, categoryParent: null, categoryName: '대분류2', categoryDepth: 1 },
  { categoryId: 4, categoryParent: 3, categoryName: '중분류2', categoryDepth: 2 },
]

const ProductCategories = () => {
  const [categories, setCategories] = useState(initialCategories)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [addingSubcategory, setAddingSubcategory] = useState(false)
  const [newMainCategoryName, setNewMainCategoryName] = useState('')

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
    const childCategories = categories.filter((cat) => cat.categoryParent === parentId)
    if (childCategories.length === 0) return null
    return childCategories.map((cat) => (
      <CListGroup key={cat.categoryId}>
        <CListGroupItem component="button" onClick={() => handleCategoryClick(cat)}>
          <CIcon
            icon={
              cat.categoryDepth === 1
                ? cilFolder
                : cat.categoryDepth === 2
                  ? cilFolderOpen
                  : cilDescription
            }
          />
          {cat.categoryName}
        </CListGroupItem>
        {cat.categoryDepth < 3 && (
          <div style={{ paddingLeft: '20px' }}>{renderCategoryTree(cat.categoryId)}</div>
        )}
      </CListGroup>
    ))
  }

  const handleEditCategory = () => {
    setCategories(
      categories.map((cat) =>
        cat.categoryId === selectedCategory.categoryId
          ? { ...cat, categoryName: editCategoryName }
          : cat,
      ),
    )
  }

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.categoryId !== id))
  }

  const handleAddSubcategory = () => {
    const newCategory = {
      categoryId: categories.length + 1,
      categoryParent: selectedCategory.categoryId,
      categoryName: newCategoryName,
      categoryDepth: selectedCategory.categoryDepth + 1,
    }
    setCategories([...categories, newCategory])
    setNewCategoryName('')
    setAddingSubcategory(false)
  }

  const handleAddMainCategory = () => {
    if (!newMainCategoryName) return

    const newCategory = {
      categoryId: categories.length + 1,
      categoryParent: null,
      categoryName: newMainCategoryName,
      categoryDepth: 1,
    }

    setCategories([...categories, newCategory])
    setNewMainCategoryName('')
  }

  return (
    <CContainer fluid>
      <CRow className="my-5 justify-content-center">
        <h3>카테고리 관리</h3>
      </CRow>
      <CRow>
        <CCol xs={4}>
          <CContainer
            style={{
              paddingLeft: '20px',
              backgroundColor: '#f0f0f0',
              borderRadius: '10px',
              height: '100%',
            }}
          >
            {renderCategoryTree()}
          </CContainer>
        </CCol>
        <CCol xs={8}>
          <CContainer style={{ backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
            {selectedCategory ? (
              <div style={{}}>
                <h5>카테고리 정보</h5>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableDataCell>상위 카테고리명</CTableDataCell>
                      <CTableDataCell>
                        {findParentCategoryName(selectedCategory.categoryParent)}
                      </CTableDataCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>카테고리명</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>

                <CButton
                  onClick={handleEditCategory}
                  disabled={editCategoryName === selectedCategory.categoryName}
                >
                  수정
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => handleDeleteCategory(selectedCategory.categoryId)}
                >
                  삭제
                </CButton>

                {!addingSubcategory && (
                  <CButton onClick={() => setAddingSubcategory(true)}>하위 카테고리 추가</CButton>
                )}
                {addingSubcategory && (
                  <div style={{ marginTop: '10px' }}>
                    <CFormInput
                      size="sm"
                      placeholder="새 하위 카테고리명"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <CButton
                      onClick={handleAddSubcategory}
                      disabled={!newCategoryName.trim()}
                      style={{ marginLeft: '10px' }}
                    >
                      추가
                    </CButton>
                  </div>
                )}
              </div>
            ) : (
              <h5>카테고리를 선택하세요</h5>
            )}
          </CContainer>

          <CContainer
            style={{ marginTop: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}
          >
            <h5>대분류 추가</h5>
            <CFormInput
              label="대분류 이름"
              size="sm"
              value={newMainCategoryName}
              onChange={(e) => setNewMainCategoryName(e.target.value)}
              fullWidth
            />
            <CButton onClick={handleAddMainCategory} style={{ marginTop: '10px' }}>
              추가
            </CButton>
          </CContainer>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProductCategories
