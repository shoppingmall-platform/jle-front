// pages/Cart/MemberCartList.js
import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CButton,
  CImage,
  CFormCheck,
  CRow,
  CCol,
} from '@coreui/react'
import OptionChange from '@/components/user/product/OptionChange'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import { updateCartItem, deleteCartItems, getCartItems } from '@/apis/member/cartApis'

const MemberCartList = () => {
  const [cartItems, setCartItems] = useState([])
  const [selectedOptions, setSelectedOptions] = useState({})
  const [visibleOption, setVisibleOption] = useState(null)
  const [quantities, setQuantities] = useState({})

  const {
    selectedItems: selectedCartItemIds,
    handleSelectAll,
    handleSelectItem,
    handleDeleteSelected,
  } = useCheckboxSelection(cartItems, 'cartItemId')

  const fetchCartItems = async () => {
    try {
      const data = await getCartItems()
      setCartItems(data.cartItems)
      const quantityMap = data.cartItems.reduce((acc, item) => {
        acc[item.cartItemId] = item.quantity
        return acc
      }, {})
      setQuantities(quantityMap)
    } catch (err) {
      console.error('장바구니 데이터를 불러오는데 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

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
    fetchCartItems()
  }

  const handleQuantityUpdate = async (cartItemId, productOptionId) => {
    const quantity = quantities[cartItemId]
    const payload = [{ cartItemId, productOptionId, quantity }]
    try {
      await updateCartItem(payload)
      fetchCartItems()
      alert('수량이 변경되었습니다!')
    } catch (err) {
      console.error('❌ 수량 변경 실패:', err)
      alert('수량 변경에 실패했습니다.')
    }
  }

  const handleDelete = async (ids) => {
    const payload = ids.map((id) => ({ cartItemId: id }))
    try {
      await deleteCartItems(payload)
      alert('삭제되었습니다.')
      handleDeleteSelected()
      fetchCartItems()
    } catch (err) {
      console.error('❌ 삭제 실패:', err)
      alert('삭제에 실패했습니다.')
    }
  }

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
    <>
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
                    {(option.productOptionDetails ?? [])
                      .map((opt) => `${opt.productOptionType}: ${opt.productOptionDetailName}`)
                      .join(' / ')}
                  </div>

                  {option.productOptionName !== '없음' && (
                    <CButton
                      color="secondary"
                      size="sm"
                      className="mt-1"
                      onClick={(e) => handleOptionChangeClick(e, item.cartItemId)}
                    >
                      옵션변경
                    </CButton>
                  )}

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
                        fetchCartItems()
                        setVisibleOption(null)
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
                      value={quantities[item.cartItemId] ?? 1}
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
                <CTableDataCell>
                  {typeof info.price === 'number'
                    ? (info.price * (quantities[item.cartItemId] || 1)).toLocaleString() + '원'
                    : '가격 없음'}
                </CTableDataCell>

                <CTableDataCell>
                  {typeof info.discountedPrice === 'number' && info.discountedPrice !== info.price
                    ? (info.discountedPrice * (quantities[item.cartItemId] || 1)).toLocaleString() +
                      '원'
                    : '-'}
                </CTableDataCell>

                <CTableDataCell>
                  {info.discountedPrice * (quantities[item.cartItemId] || 1) >= 70000
                    ? '0원'
                    : '3,000원'}
                </CTableDataCell>

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

      <div className="text-center">
        <CButton color="dark" className="me-2">
          전체상품주문
        </CButton>
        <CButton color="secondary" variant="outline">
          선택상품주문
        </CButton>
      </div>
    </>
  )
}

export default MemberCartList
