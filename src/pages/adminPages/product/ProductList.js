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
import { cilSearch } from '@coreui/icons' // 아이콘 불러오기
import CIcon from '@coreui/icons-react'
import { React, useState, useEffect } from 'react'
import '../adminpage.css'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import DateRangePicker from '@/components/admin/DateRangePicker'
import CategoryPicker from '@/components/admin/product/CategoryPicker'
import { getProductList } from '@/apis/product/productApis'

const data = {
  total: 5, // 전체 건수
  sold: 3, // 판매된 건수
  unsold: 2, // 판매되지 않은 건수
}

const ProductList = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [productData, setProductData] = useState([])
  const [category, setCategory] = useState('')
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductList({ page: 0, size: 10 }) // API 호출

        // API 응답이 배열인지 확인하고 사용
        if (response && Array.isArray(response.data)) {
          const formattedProductData = response.data.map((product, index) => ({
            productCode: product.id,
            productName: product.name,
            salePrice: `${product.price.toLocaleString()}원`,
            discountPrice: product.discountedPrice
              ? `${product.discountedPrice.toLocaleString()}원`
              : '-',
            category: `카테고리 ${product.categoryId}`,
            note: product.description || '-',
          }))

          setProductData(formattedProductData)
        } else {
          setProductData([]) // 데이터가 없을 경우 빈 배열 설정
        }
      } catch (error) {
        console.error('❌ 상품 목록 조회 실패:', error)
      }
    }

    fetchProducts()
  }, [])

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
                  검색분류
                </td>
                <td colSpan="7">
                  <div className="d-flex align-items-center gap-2">
                    <CFormSelect className="small-select" onChange={() => setSelectCategory()}>
                      <option>상품명</option>
                      <option value="a">a</option>
                    </CFormSelect>

                    <CFormInput size="sm" placeholder="검색어를 입력하세요" />

                    <CButton size="sm" className="ms-2" aria-label="검색">
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
              <tr>
                <td className="text-center table-header">진열상태</td>
                <td colSpan="7">
                  <div className="radio-group">
                    <CFormCheck type="radio" name="saleStatus" value="T" label="전체" />
                    <CFormCheck type="radio" name="saleStatus" value="T" label="진열함" />
                    <CFormCheck type="radio" name="saleStatus" value="F" label="진열안함" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">판매상태</td>
                <td colSpan="7">
                  <div className="radio-group">
                    <CFormCheck type="radio" name="saleStatus" value="T" label="전체" />
                    <CFormCheck type="radio" name="saleStatus" value="T" label="판매함" />
                    <CFormCheck type="radio" name="saleStatus" value="F" label="판매안함" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <div className="button-group">
        <CButton color="primary">검색</CButton>
        <CButton color="primary">초기화</CButton>
      </div>
      <CCard>
        <CCardHeader>상품 목록</CCardHeader>
        <CCardBody>
          <div className="body-section">
            <CRow className="align-items-center">
              <CCol md="6">
                <span className="fw-bold">총 0개</span>
              </CCol>
              <CCol md="6" className="d-flex justify-content-end gap-2">
                <CFormSelect size="sm" style={{ width: 'auto' }}>
                  <option>등록일 순</option>
                  <option>상품명 순</option>
                </CFormSelect>
                <CFormSelect size="sm" style={{ width: 'auto' }}>
                  <option>10개씩 보기</option>
                  <option>20개씩 보기</option>
                  <option>50개씩 보기</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>
          <div className="body-section">
            <CButton className="custom-button">진열함</CButton>
            <CButton className="custom-button">진열안함</CButton>
            <CButton className="custom-button">판매함</CButton>
            <CButton className="custom-button">판매안함</CButton>
            <CButton className="custom-button">삭제</CButton>
            <CButton className="custom-button">복사</CButton>
          </div>
          <table className="table">
            {/* 표의 헤더 */}
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
                <th>상품구분</th>
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
                  <td>{product.category}</td>
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
