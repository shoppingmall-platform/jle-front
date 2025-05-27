import React, { useState, useEffect } from 'react'
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
import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import { updateCartItem, deleteCartItems, getCartItems } from '@/apis/member/cartApis'

const Cart = () => {
  // 임시 mock data -> api 연결되면 삭제하고 주석처리로 대체
  const cartItems = [
    {
      cartItemId: 1,
      quantity: 1,
      productOptionInfo: {
        productOptionId: 1,
        productInfo: {
          productId: 101,
          name: '[기획특가] 마프 카라 스트링 윈드 자켓 5 Color',
          price: 39800,
          discountedPrice: 29800,
          thumbnailPath:
            'https://vaidoh.com/web/product/tiny/202302/467585cbd65644e8cbd96dcf4f3261e9.webp',
          productOptions: [
            {
              productOptionId: 1,
              productOptionName: 'M/화이트',
              productOptionDetails: [
                { productOptionType: '사이즈', productOptionDetailName: 'M' },
                { productOptionType: '색상', productOptionDetailName: '화이트' },
              ],
              stockQuantity: 10,
              additionalPrice: 0,
            },
            {
              productOptionId: 2,
              productOptionName: 'M/블랙',
              productOptionDetails: [
                { productOptionType: '사이즈', productOptionDetailName: 'M' },
                { productOptionType: '색상', productOptionDetailName: '블랙' },
              ],
              stockQuantity: 5,
              additionalPrice: 0,
            },
            {
              productOptionId: 3,
              productOptionName: 'M/카키',
              productOptionDetails: [
                { productOptionType: '사이즈', productOptionDetailName: 'M' },
                { productOptionType: '색상', productOptionDetailName: '카키' },
              ],
              stockQuantity: 8,
              additionalPrice: 0,
            },
            {
              productOptionId: 4,
              productOptionName: 'L/화이트',
              productOptionDetails: [
                { productOptionType: '사이즈', productOptionDetailName: 'L' },
                { productOptionType: '색상', productOptionDetailName: '화이트' },
              ],
              stockQuantity: 3,
              additionalPrice: 0,
            },
            {
              productOptionId: 5,
              productOptionName: 'L/블랙',
              productOptionDetails: [
                { productOptionType: '사이즈', productOptionDetailName: 'L' },
                { productOptionType: '색상', productOptionDetailName: '블랙' },
              ],
              stockQuantity: 7,
              additionalPrice: 0,
            },
            {
              productOptionId: 6,
              productOptionName: 'L/카키',
              productOptionDetails: [
                { productOptionType: '사이즈', productOptionDetailName: 'L' },
                { productOptionType: '색상', productOptionDetailName: '카키' },
              ],
              stockQuantity: 4,
              additionalPrice: 0,
            },
          ],
        },
      },
    },
    {
      cartItemId: 2,
      quantity: 2,
      productOptionInfo: {
        productOptionId: 7,
        productInfo: {
          productId: 102,
          name: '[Vidoh Made] 워시드 시그니처 크롭 데님 자켓 2 Color',
          price: 118000,
          discountedPrice: 118000,
          thumbnailPath:
            'https://vaidoh.com/web/product/tiny/202504/df67840462339e71359a968cd0e1b084.webp',
          productOptions: [
            {
              productOptionId: 7,
              productOptionName: 'FREE/화이트',
              productOptionDetails: [
                { productOptionType: '사이즈', productOptionDetailName: 'FREE' },
                { productOptionType: '색상', productOptionDetailName: '화이트' },
              ],
              stockQuantity: 5,
              additionalPrice: 0,
            },
            {
              productOptionId: 8,
              productOptionName: 'FREE/블랙',
              productOptionDetails: [
                { productOptionType: '사이즈', productOptionDetailName: 'FREE' },
                { productOptionType: '색상', productOptionDetailName: '블랙' },
              ],
              stockQuantity: 5,
              additionalPrice: 0,
            },
          ],
        },
      },
    },
  ]
  //   const [cartItems, setCartItems] = useState([]) // 기존 mock data 대체

  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     try {
  //       const data = await getCartItems()
  //       setCartItems(data)

  //       // 수량 상태도 초기화
  //       const quantityMap = data.reduce((acc, item) => {
  //         acc[item.cartItemId] = item.quantity
  //         return acc
  //       }, {})
  //       setQuantities(quantityMap)
  //     } catch (err) {
  //       console.error('장바구니 데이터를 불러오는데 실패했습니다.')
  //     }
  //   }

  //   fetchCartItems()
  // }, [])

  const [selectedOptions, setSelectedOptions] = useState({})
  const [visibleOption, setVisibleOption] = useState(null)
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.cartItemId]: item.quantity }), {}),
  )

  const {
    selectedItems: selectedCartItemIds,
    handleSelectAll,
    handleSelectItem,
    handleDeleteSelected,
  } = useCheckboxSelection(cartItems, 'cartItemId')

  const handleQuantityChange = (cartItemId, value) => {
    setQuantities({ ...quantities, [cartItemId]: parseInt(value) })
  }
  const handleOptionChangeClick = (e, cartItemId) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setVisibleOption({
      cartItemId,
      top: rect.top + window.scrollY + e.currentTarget.offsetHeight + 5,
      left: rect.left + window.scrollX,
    })
  }

  const closeOptionChange = () => setVisibleOption(null)

  //수량변경
  const handleQuantityUpdate = async (cartItemId, productOptionId) => {
    const quantity = quantities[cartItemId]

    const payload = [
      {
        cartItemId,
        productOptionId,
        quantity,
      },
    ]

    console.log('🛒 수량 변경 요청 데이터:', payload)

    try {
      const response = await updateCartItem(payload)
      console.log('✅ 수량 변경 응답:', response)
      alert('수량이 변경되었습니다!')
    } catch (err) {
      console.error('❌ 수량 변경 실패:', err)
      alert('수량 변경에 실패했습니다.')
    }
  }

  //삭제
  const handleDelete = async (ids) => {
    const payload = ids.map((id) => ({ cartItemId: id }))
    console.log('🗑️ 장바구니 삭제 요청 데이터:', payload)

    try {
      await deleteCartItems(payload)
      alert('삭제되었습니다.')
      handleDeleteSelected()
    } catch (err) {
      console.error('❌ 삭제 실패:', err)
      alert('삭제에 실패했습니다.')
    }
  }
  // 총 금액 계산
  const totalSelectedPrice = cartItems
    .filter((item) => selectedCartItemIds.includes(item.cartItemId))
    .reduce(
      (sum, item) =>
        sum +
        item.productOptionInfo.productInfo.discountedPrice * (quantities[item.cartItemId] || 1),
      0,
    )

  const totalShippingFee = selectedCartItemIds.length === 0 || totalSelectedPrice < 70000 ? 3000 : 0

  const totalPayment = totalSelectedPrice + totalShippingFee

  return (
    <CContainer className="mt-5 mb-5" style={{ maxWidth: '1100px' }}>
      <h4 className="mb-4 text-center">장바구니</h4>
      <CTable align="middle" responsive className="custom-header">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">
              <CFormCheck
                checked={selectedCartItemIds.length === cartItems.length}
                onChange={handleSelectAll}
              />
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">이미지</CTableHeaderCell>
            <CTableHeaderCell scope="col">상품정보</CTableHeaderCell>
            <CTableHeaderCell scope="col">수량</CTableHeaderCell>
            <CTableHeaderCell scope="col">상품금액</CTableHeaderCell>
            <CTableHeaderCell scope="col">할인된 금액</CTableHeaderCell>
            <CTableHeaderCell scope="col">배송비</CTableHeaderCell>
            <CTableHeaderCell scope="col">선택</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {cartItems.map((item) => {
            const info = item.productOptionInfo.productInfo
            const option = info.productOptions.find(
              (opt) => opt.productOptionId === item.productOptionInfo.productOptionId,
            )
            return (
              <CTableRow key={item.cartItemId}>
                <CTableDataCell>
                  <CFormCheck
                    checked={selectedCartItemIds.includes(item.cartItemId)}
                    onChange={() => handleSelectItem(item.cartItemId)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CImage src={info.thumbnailPath} width={80} />
                </CTableDataCell>
                <CTableDataCell className="text-start">
                  <div>{info.name}</div>
                  <div className="text-muted small">
                    {option.productOptionDetails
                      .map((opt) => `${opt.productOptionType}: ${opt.productOptionDetailName}`)
                      .join(' / ')}
                  </div>
                  <CButton
                    color="secondary"
                    size="sm"
                    className="mt-1"
                    onClick={(e) => handleOptionChangeClick(e, item.cartItemId)}
                  >
                    옵션변경
                  </CButton>
                  {visibleOption?.cartItemId === item.cartItemId && (
                    <OptionChange
                      cartItemId={item.cartItemId}
                      top={visibleOption.top}
                      left={visibleOption.left}
                      productOptions={info.productOptions}
                      selectedOptions={selectedOptions[item.cartItemId] || {}}
                      quantity={quantities[item.cartItemId]}
                      handleSelectOption={(type, value) =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [item.cartItemId]: { ...prev[item.cartItemId], [type]: value },
                        }))
                      }
                      onUpdateSuccess={() => {
                        // 장바구니 재조회 or 수동 리렌더링
                        console.log('✅ 변경 후 로직')
                      }}
                      onClose={() => setVisibleOption(null)}
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
                      value={quantities[item.cartItemId] || 1}
                      onChange={(e) => handleQuantityChange(item.cartItemId, e.target.value)}
                    />
                    <CButton
                      color="secondary"
                      size="sm"
                      className="ms-2"
                      onClick={() =>
                        handleQuantityUpdate(
                          item.cartItemId,
                          item.productOptionInfo.productOptionId,
                          quantities[item.cartItemId],
                        )
                      }
                    >
                      변경
                    </CButton>
                  </div>
                </CTableDataCell>
                <CTableDataCell>{info.price.toLocaleString()}원</CTableDataCell>
                {/* <CTableDataCell>
                  {info.discountedPrice !== info.price
                    ? `${(info.price - info.discountedPrice).toLocaleString()}원`
                    : '-'}
                </CTableDataCell> 할인된 금액을 넣을건지 할인금액을 넣을건지..?  */}
                <CTableDataCell>{info.discountedPrice.toLocaleString()}원</CTableDataCell>
                <CTableDataCell>{info.discountedPrice >= 70000 ? '0원' : '3,000원'}</CTableDataCell>

                <CTableDataCell>
                  <div className="d-flex flex-column">
                    <CButton color="primary" size="sm" className="mb-1">
                      주문하기
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete([item.cartItemId])}
                    >
                      삭제
                    </CButton>
                    <CButton color="black" size="sm" variant="outline" className="mt-1">
                      관심상품등록
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            )
          })}
        </CTableBody>
      </CTable>

      <CRow className="my-3">
        <CCol className="text-start">
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={() => handleDelete(selectedCartItemIds)}
          >
            선택상품 삭제
          </CButton>
        </CCol>
        <CCol className="text-end">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() => handleDelete(cartItems.map((item) => item.cartItemId))}
          >
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
            {selectedCartItemIds.length === 0 ? '-' : totalSelectedPrice.toLocaleString() + '원'}
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">총 배송비</div>
          <div className="fw-bold">
            {selectedCartItemIds.length === 0 ? '-' : totalShippingFee.toLocaleString() + '원'}
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">결제예정금액</div>
          <div className="fw-bold">
            {selectedCartItemIds.length === 0 ? '-' : totalPayment.toLocaleString() + '원'}
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
