import { React, useState, useEffect } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CFormCheck,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormTextarea,
} from '@coreui/react'
import '../adminpage.css'
import DateRangePicker from '@/components/admin/DateRangePicker'
import CategoryPicker from '@/components/admin/product/CategoryPicker'
import { getProductList } from '@/apis/product/productApis'
import { registerDiscount } from '@/apis/product/discountApis'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'

const DiscountAdd = () => {
  const [discountName, setDiscountName] = useState('')
  const [discountType, setDiscountType] = useState('할인율')
  const [discountValue, setDiscountValue] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [scopeType, setScopeType] = useState('0')

  const [productData, setProductData] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductList({}, { page: 0, size: 20 })
        if (Array.isArray(res)) {
          const formatted = res.map((p) => ({
            productCode: p.productId,
            productName: p.name,
            salePrice: `${p.price.toLocaleString()}원`,
            discountPrice: p.discountedPrice ? `${p.discountedPrice.toLocaleString()}원` : '-',
          }))
          setProductData(formatted)
        }
      } catch (error) {
        console.error('상품 목록 조회 실패:', error)
      }
    }
    fetchProducts()
  }, [])

  const handleToggleProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleRegister = async () => {
    if (!discountName || !discountType || !discountValue || !startDate || !endDate) {
      alert('모든 필수 항목을 입력해주세요!')
      return
    }
    if (scopeType === '1' && selectedProducts.length === 0) {
      alert('특정 상품을 선택해주세요.')
      return
    }

    if (scopeType === '2' && !selectedCategory) {
      alert('카테고리를 선택해주세요.')
      return
    }

    const newDiscount = {
      discountName,
      discountType,
      discountValue: Number(discountValue),
      discountStartDate: new Date(startDate).toISOString(),
      discountEndDate: new Date(endDate).toISOString(),
      applyType: Number(scopeType),
      ids:
        scopeType === '0'
          ? null
          : scopeType === '1'
            ? selectedProducts
            : scopeType === '2'
              ? [selectedCategory]
              : null,
    }
    console.log('최종 전송 데이터:', newDiscount)

    setLoading(true)
    try {
      await registerDiscount(newDiscount)
      alert('할인이 성공적으로 등록되었습니다!')
    } catch (error) {
      alert('할인 등록 실패: ' + (error.response?.data?.message || '알 수 없는 오류'))
    } finally {
      setLoading(false)
    }
  }
  const handleScopeChange = (e) => {
    setScopeType(e.target.value)
  }
  const productCheckbox = useCheckboxSelection(productData, 'productCode')
  useEffect(() => {
    setSelectedProducts(productCheckbox.selectedItems)
  }, [productCheckbox.selectedItems])

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>할인 등록</h3>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>기본 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">할인코드 입력</td>
                <td colSpan="4">
                  <CFormInput
                    className="small-form"
                    value={discountName}
                    onChange={(e) => setDiscountName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="text-center table-header ">혜택구분</td>
                <td colSpan="4">
                  <div className="d-flex gap-3">
                    <div className="radio-group">
                      <CFormCheck
                        type="radio"
                        name="혜택구분"
                        value="할인율"
                        label="할인율"
                        checked={discountType === '할인율'}
                        onChange={(e) => {
                          setDiscountType(e.target.value)
                          setDiscountValue('') // 타입 변경 시 값 초기화
                        }}
                      />
                      <CFormCheck
                        type="radio"
                        name="혜택구분"
                        value="할인금액"
                        label="할인금액"
                        checked={discountType === '할인금액'}
                        onChange={(e) => {
                          setDiscountType(e.target.value)
                          setDiscountValue('') // 타입 변경 시 값 초기화
                        }}
                      />
                    </div>
                    {discountType === '할인율' && (
                      <CInputGroup className="x-small-form">
                        <CFormInput
                          type="number"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                        />
                        <CInputGroupText>%</CInputGroupText>
                      </CInputGroup>
                    )}

                    {discountType === '할인금액' && (
                      <CInputGroup className="x-small-form">
                        <CFormInput
                          type="number"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                        />
                        <CInputGroupText>원</CInputGroupText>
                      </CInputGroup>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>사용 정보</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">사용기간</td>
                <td colSpan="4">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    showButtons={true}
                    includeTime={true}
                    mode="future"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-center table-header">적용범위</td>
                <td colSpan="4">
                  <div className="radio-group">
                    <CFormCheck
                      type="radio"
                      name="scopeType"
                      value="0"
                      label="전체상품"
                      checked={scopeType === '전체상품'}
                      onChange={handleScopeChange}
                    />
                    <CFormCheck
                      type="radio"
                      name="scopeType"
                      value="1"
                      label="특정상품"
                      checked={scopeType === '특정상품'}
                      onChange={handleScopeChange}
                    />
                    <CFormCheck
                      type="radio"
                      name="scopeType"
                      value="2"
                      label="특정분류"
                      checked={scopeType === '특정분류'}
                      onChange={handleScopeChange}
                    />
                  </div>
                </td>
              </tr>
              {scopeType === '1' && (
                <tr>
                  <td className="text-center table-header">상품 목록</td>
                  <td colSpan="4">
                    <table className="table table-bordered table-sm">
                      <thead>
                        <tr>
                          <th>
                            <CFormCheck
                              checked={
                                productCheckbox.selectedItems.length === productData.length &&
                                productData.length > 0
                              }
                              onChange={productCheckbox.handleSelectAll}
                            />
                          </th>
                          <th>상품명</th>
                          <th>판매가</th>
                          <th>할인가</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.length > 0 ? (
                          productData.map((product) => (
                            <tr key={product.productCode}>
                              <td>
                                <CFormCheck
                                  checked={productCheckbox.selectedItems.includes(
                                    product.productCode,
                                  )}
                                  onChange={() =>
                                    productCheckbox.handleSelectItem(product.productCode)
                                  }
                                />
                              </td>
                              <td>{product.productName}</td>
                              <td>{product.salePrice}</td>
                              <td>{product.discountPrice}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              상품이 없습니다.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}

              {scopeType === '2' && (
                <tr>
                  <td className="text-center table-header">카테고리</td>
                  <td colSpan="4">
                    <CategoryPicker
                      onCategoryChange={(categoryId) => setSelectedCategory(categoryId)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <div className="button-group">
        <CButton color="primary" onClick={handleRegister}>
          저장{' '}
        </CButton>
      </div>
    </div>
  )
}

export default DiscountAdd
