import React, { useState } from 'react'
import {
  CContainer,
  CTable,
  CTableHead,
  CRow,
  CCol,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CButton,
  CImage,
  CFormCheck,
} from '@coreui/react'
import OptionChange from '@/components/user/product/OptionChange'

const buildOptionTypes = (productOptions) => {
  const optionTypes = {}
  productOptions.forEach((option) => {
    option.productOptionDetails.forEach((detail) => {
      const type = detail.productOptionType
      const value = detail.productOptionDetailName
      if (!optionTypes[type]) optionTypes[type] = new Set()
      optionTypes[type].add(value)
    })
  })
  // Set → Array 변환
  Object.keys(optionTypes).forEach((key) => {
    optionTypes[key] = Array.from(optionTypes[key])
  })
  return optionTypes
}

const Cart = () => {
  // 임시 mock data
  const cartItems = [
    {
      productId: 1,
      name: '[기획특가] 마프 카라 스트링 윈드 자켓 5 Color',
      thumbnailPath:
        'https://vaidoh.com/web/product/tiny/202302/467585cbd65644e8cbd96dcf4f3261e9.webp',
      price: 29800,
      discountedPrice: 29800,
      productOptions: [
        {
          productOptionName: '옵션',
          productOptionDetails: [
            { productOptionType: '색상', productOptionDetailName: '소라' },
            { productOptionType: '사이즈', productOptionDetailName: 'FREE' },
          ],
        },
      ],
      quantity: 1, // 직접 state 관리
    },
    {
      productId: 2,
      name: '[Vidoh Made] 워시드 시그니처 크롭 데님 자켓 2 Color',
      thumbnailPath:
        'https://vaidoh.com/web/product/tiny/202504/df67840462339e71359a968cd0e1b084.webp',
      price: 118000,
      discountedPrice: 118000,
      productOptions: [
        {
          productOptionName: '옵션',
          productOptionDetails: [
            { productOptionType: '색상', productOptionDetailName: '중청' },
            { productOptionType: '사이즈', productOptionDetailName: 'FREE' },
          ],
        },
      ],
      quantity: 2,
    },
  ]
  const productOptions = [
    // API 응답 예시 (단일 상품 기준)
    {
      productOptionName: 'M/블랙',
      productOptionDetails: [
        { productOptionType: '사이즈', productOptionDetailName: 'M' },
        { productOptionType: '색상', productOptionDetailName: '블랙' },
      ],
      stockQuantity: 5,
      additionalPrice: 0,
    },
    {
      productOptionName: 'L/화이트',
      productOptionDetails: [
        { productOptionType: '사이즈', productOptionDetailName: 'L' },
        { productOptionType: '색상', productOptionDetailName: '화이트' },
      ],
      stockQuantity: 3,
      additionalPrice: 0,
    },
    // ... 더 많은 옵션
  ]
  const optionTypes = buildOptionTypes(productOptions)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [visibleOption, setVisibleOption] = useState(null) // { top, left }
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.productId]: item.quantity }), {}),
  )

  const handleSelectOption = (type, value) => {
    setSelectedOptions((prev) => ({ ...prev, [type]: value }))
  }

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: parseInt(value) })
  }

  const handleOptionChangeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setVisibleOption({
      top: rect.top + window.scrollY + e.currentTarget.offsetHeight + 5,
      left: rect.left + window.scrollX,
    })
  }

  const closeOptionChange = () => setVisibleOption(null)

  return (
    <CContainer className="mt-5 mb-5" style={{ maxWidth: '1100px' }}>
      <h4 className="mb-4 text-center">장바구니</h4>
      <CTable align="middle" responsive className="custom-header">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">
              <CFormCheck />
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">이미지</CTableHeaderCell>
            <CTableHeaderCell scope="col">상품정보</CTableHeaderCell>
            <CTableHeaderCell scope="col">수량</CTableHeaderCell>
            <CTableHeaderCell scope="col">상품금액</CTableHeaderCell>
            <CTableHeaderCell scope="col">할인금액</CTableHeaderCell>
            <CTableHeaderCell scope="col">배송비</CTableHeaderCell>
            <CTableHeaderCell scope="col">선택</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {cartItems.map((item) => (
            <CTableRow key={item.productId}>
              <CTableDataCell>
                <CFormCheck />
              </CTableDataCell>
              <CTableDataCell>
                <CImage src={item.thumbnailPath} width={80} />
              </CTableDataCell>
              <CTableDataCell className="text-start">
                <div>{item.name}</div>
                <div className="text-muted small">
                  {item.productOptions[0].productOptionDetails
                    .map((opt) => `${opt.productOptionType}: ${opt.productOptionDetailName}`)
                    .join(' / ')}
                </div>
                <CButton
                  color="secondary"
                  size="sm"
                  className="mt-1"
                  onClick={handleOptionChangeClick}
                >
                  옵션변경
                </CButton>
                {visibleOption && (
                  <OptionChange
                    top={visibleOption.top}
                    left={visibleOption.left}
                    optionTypes={optionTypes}
                    selectedOptions={selectedOptions}
                    handleSelectOption={handleSelectOption}
                    onClose={closeOptionChange}
                  />
                )}
              </CTableDataCell>
              <CTableDataCell>
                <div className="d-flex align-items-center">
                  <CFormInput
                    type="number"
                    min="1"
                    size="sm"
                    style={{ width: '60px' }}
                    value={quantities[item.productId]}
                    onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                  />
                  <CButton color="secondary" size="sm" className="ms-2">
                    변경
                  </CButton>
                </div>
              </CTableDataCell>
              <CTableDataCell>{item.price.toLocaleString()}원</CTableDataCell>
              <CTableDataCell>
                {item.discountedPrice !== item.price
                  ? `${(item.price - item.discountedPrice).toLocaleString()}원`
                  : '-'}
              </CTableDataCell>
              <CTableDataCell>{item.shippingFee}</CTableDataCell>
              <CTableDataCell>
                <div className="d-flex flex-column">
                  <CButton color="primary" size="sm" className="mb-1">
                    주문하기
                  </CButton>
                  <CButton color="danger" size="sm" variant="outline">
                    삭제
                  </CButton>
                  <CButton color="black" size="sm" variant="outline" className="mt-1">
                    관심상품등록
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CRow className="my-3">
        <CCol className="text-start">
          <CButton color="danger" variant="outline" size="sm">
            선택상품 삭제
          </CButton>
        </CCol>
        <CCol className="text-end">
          <CButton color="secondary" variant="outline" size="sm">
            장바구니 비우기
          </CButton>
        </CCol>
      </CRow>

      <hr />

      {/* 총 금액 영역 */}
      <CRow className="text-center my-4">
        <CCol>
          <div className="text-muted small">총 상품금액</div>
          <div className="fw-bold">
            {cartItems
              .reduce((sum, item) => sum + item.price * quantities[item.productId], 0)
              .toLocaleString()}
            원
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">총 배송비</div>
          <div className="fw-bold">0원</div>
        </CCol>
        <CCol>
          <div className="text-muted small">결제예정금액</div>
          <div className="fw-bold">
            {(
              cartItems.reduce((sum, item) => sum + item.price * quantities[item.productId], 0) + 0
            ).toLocaleString()}
            원
          </div>
        </CCol>
      </CRow>
      <hr />
      {/* 주문 버튼 */}
      <div className="text-center">
        <CButton color="dark" className="me-2">
          전체상품주문
        </CButton>
        <CButton color="secondary" variant="outline">
          선택상품주문
        </CButton>
      </div>
    </CContainer>
  )
}

export default Cart
