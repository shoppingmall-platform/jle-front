import {
  CButton,
  CFormInput,
  CFormCheck,
  CFormSelect,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
} from '@coreui/react'
import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { React, useState } from 'react'

import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import DateRangePicker from '@/components/admin/DateRangePicker'
import CategoryPicker from '@/components/admin/product/CategoryPicker'
import { getProductList } from '@/apis/product/productApis'

const data = {
  total: 5,
  sold: 3,
  unsold: 2,
}

const ProductList = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [productData, setProductData] = useState([])
  const [category, setCategory] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)

  const fetchProducts = async () => {
    try {
      const requestBody = {
        condition: {
          keyword: searchKeyword || '',
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          categoryId: category || null,
          isSelling: null,
          isDeleted: null,
          conditionEmpty: false,
        },
        pageable: {
          page,
          size,
          sort: [],
        },
      }

      const data = await getProductList(requestBody)

      if (Array.isArray(data)) {
        const formattedProductData = data.map((product, index) => ({
          productCode: product.productId,
          productName: product.name,
          salePrice: `${product.price.toLocaleString()}원`,
          discountPrice: product.discountedPrice
            ? `${product.discountedPrice.toLocaleString()}원`
            : '-',
          category: `${product.categoryId}`,
          note: '-',
        }))
        setProductData(formattedProductData)
      } else {
        setProductData([])
      }
    } catch (error) {
      console.error('❌ 상품 목록 조회 실패:', error)
    }
  }

  const productCheckbox = useCheckboxSelection(productData, 'productCode')

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>상품 목록</h3>
      </CRow>

      <CCard className="mb-4">
        <CCardBody>
          <div>
            <CRow>
              <div
                style={{
                  justifyContent: 'flex-start',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                <span>전체: {data.total}건</span>
                <span>판매함: {data.sold}건</span>
                <span>판매안함: {data.unsold}건</span>
              </div>
            </CRow>
          </div>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>상품 검색</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header" style={{ width: '15%' }}>
                  상품명
                </td>
                <td colSpan="7">
                  <div className="d-flex align-items-center gap-2">
                    <CFormInput
                      size="sm"
                      placeholder="검색어를 입력하세요"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <CButton size="sm" className="ms-2" aria-label="검색" onClick={fetchProducts}>
                      <CIcon icon={cilSearch} />
                    </CButton>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">카테고리</td>
                <td colSpan="7">
                  <CategoryPicker onCategoryChange={(categoryId) => setCategory(categoryId)} />
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">상품 등록일</td>
                <td colSpan="7">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      showButtons={true}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <div className="button-group d-flex justify-content-center gap-2 mt-3">
        <CButton color="primary" onClick={fetchProducts}>
          검색
        </CButton>
        <CButton
          color="secondary"
          onClick={() => {
            setSearchKeyword('')
            setCategory(null)
            setStartDate(null)
            setEndDate(null)
            fetchProducts()
          }}
        >
          초기화
        </CButton>
      </div>

      <CCard>
        <CCardHeader>상품 목록</CCardHeader>
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md="6">
              <span className="fw-bold">총 {productData.length}개</span>
            </CCol>
            <CCol md="6" className="d-flex justify-content-end gap-2">
              <CFormSelect size="sm" style={{ width: 'auto' }}>
                <option>등록일 순</option>
                <option>상품명 순</option>
              </CFormSelect>
              <CFormSelect
                size="sm"
                style={{ width: 'auto' }}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              >
                <option value={10}>10개씩 보기</option>
                <option value={20}>20개씩 보기</option>
                <option value={50}>50개씩 보기</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <div className="my-3">
            <CButton className="custom-button">진열함</CButton>
            <CButton className="custom-button">진열안함</CButton>
            <CButton className="custom-button">판매함</CButton>
            <CButton className="custom-button">판매안함</CButton>
            <CButton className="custom-button">삭제</CButton>
            <CButton className="custom-button">복사</CButton>
          </div>

          <table className="table">
            <thead className="table-head">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={productCheckbox.selectedItems.length === productData.length}
                    onChange={productCheckbox.handleSelectAll}
                  />
                </th>
                <th>No</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>판매가</th>
                <th>할인가</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {productData.map((product, index) => (
                <tr key={product.productCode}>
                  <td>
                    <input
                      type="checkbox"
                      checked={productCheckbox.selectedItems.includes(product.productCode)}
                      onChange={() => productCheckbox.handleSelectItem(product.productCode)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{product.productCode}</td>
                  <td>{product.productName}</td>
                  <td>{product.salePrice}</td>
                  <td>{product.discountPrice}</td>
                  <td>{product.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default ProductList
