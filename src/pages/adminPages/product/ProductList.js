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
import { getProductList, deleteProducts } from '@/apis/product/productApis'

const ProductList = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [productData, setProductData] = useState([])
  const [category, setCategory] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const [showDeleted, setShowDeleted] = useState('all') // 'all', 'active', 'deleted'

  // ✅ 통계 데이터 state 추가
  const [statistics, setStatistics] = useState({
    total: 0,
    sold: 0,
    unsold: 0,
  })

  const fetchProducts = async () => {
    try {
      const requestBody = {
        condition: {
          keyword: searchKeyword || '',
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          categoryId: category || null,
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
          // ✅ 판매 상태 추가 (백엔드 응답에 있다면 사용, 없으면 기본값)
          isSelling: product.isSelling ?? true,
          // ✅ 삭제 상태 추가
          isDeleted: product.deleted || product.isDeleted || false,
        }))

        // ✅ 삭제 상태에 따른 필터링
        let filteredData = formattedProductData
        if (showDeleted === 'active') {
          filteredData = formattedProductData.filter((p) => !p.isDeleted)
        } else if (showDeleted === 'deleted') {
          filteredData = formattedProductData.filter((p) => p.isDeleted)
        }

        setProductData(filteredData)

        // ✅ 통계 계산 (전체 데이터 기준)
        const total = formattedProductData.length
        const active = formattedProductData.filter((p) => !p.isDeleted).length
        const deleted = formattedProductData.filter((p) => p.isDeleted).length

        setStatistics({
          total,
          sold: active,
          unsold: deleted,
        })
      } else {
        setProductData([])
        setStatistics({ total: 0, sold: 0, unsold: 0 })
      }
    } catch (error) {
      console.error('❌ 상품 목록 조회 실패:', error)
      setProductData([])
      setStatistics({ total: 0, sold: 0, unsold: 0 })
    }
  }

  // 상품 삭제 핸들러
  const handleDeleteProducts = async () => {
    if (productCheckbox.selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.')
      return
    }

    const confirmMessage = `선택한 ${productCheckbox.selectedItems.length}개의 상품을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      const result = await deleteProducts(productCheckbox.selectedItems)

      if (result.failed > 0) {
        alert(`처리 완료\n성공: ${result.succeeded}개\n실패: ${result.failed}개`)
      } else {
        alert(`선택한 ${result.succeeded}개의 상품이 성공적으로 삭제되었습니다.`)
      }

      // 목록 새로고침
      fetchProducts()

      // 체크박스 초기화
      productCheckbox.handleSelectItem([])
    } catch (error) {
      console.error('❌ 상품 삭제 처리 오류:', error)
      alert('상품 삭제 처리 중 오류가 발생했습니다.\n' + error.message)
    }
  }

  const productCheckbox = useCheckboxSelection(productData, 'productCode')

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>상품 목록</h3>
      </CRow>

      {/* ✅ 통계 카드 - 실제 데이터 반영 */}
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
                <span>전체: {statistics.total}건</span>
                <span className="text-success">판매중: {statistics.sold}건</span>
                <span className="text-danger">삭제됨: {statistics.unsold}건</span>
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
              <CFormSelect
                size="sm"
                style={{ width: 'auto' }}
                value={showDeleted}
                onChange={(e) => {
                  setShowDeleted(e.target.value)
                  // 필터 변경 시 자동으로 다시 조회
                  setTimeout(() => fetchProducts(), 0)
                }}
              >
                <option value="all">전체 상품</option>
                <option value="active">판매중만</option>
                <option value="deleted">삭제됨만</option>
              </CFormSelect>
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
            <CButton
              className="custom-button"
              onClick={handleDeleteProducts}
              disabled={productCheckbox.selectedItems.length === 0}
            >
              삭제
            </CButton>
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
                <th>상태</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {productData.map((product, index) => (
                <tr
                  key={product.productCode}
                  style={{
                    opacity: product.isDeleted ? 0.5 : 1,
                    backgroundColor: product.isDeleted ? '#f8f9fa' : 'transparent',
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={productCheckbox.selectedItems.includes(product.productCode)}
                      onChange={() => productCheckbox.handleSelectItem(product.productCode)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{product.productCode}</td>
                  <td>
                    {product.productName}
                    {product.isDeleted}
                  </td>
                  <td>{product.salePrice}</td>
                  <td>{product.discountPrice}</td>
                  <td>
                    {product.isDeleted ? (
                      <span className="badge bg-danger">삭제됨</span>
                    ) : (
                      <span className="badge bg-success">판매중</span>
                    )}
                  </td>
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
