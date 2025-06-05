import React, { useState } from 'react'
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
import useGuestCartStore from '@/store/member/guestCartStore'
import useCheckboxSelection from '@/hooks/useCheckboxSelection'
import OptionChange from '@/components/user/product/OptionChange'

const GuestCartList = () => {
  const { cartItems, updateQuantity, removeItem, clearCart, updateOption } = useGuestCartStore()

  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.productOptionId] = item.quantity
      return acc
    }, {}),
  )
  const [visibleOption, setVisibleOption] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState({})
  const {
    selectedItems: selectedIds,
    handleSelectAll,
    handleSelectItem,
    handleDeleteSelected,
  } = useCheckboxSelection(cartItems, 'productOptionId')

  const handleOptionChangeClick = (e, productOptionId) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setVisibleOption({
      productOptionId,
      top: rect.top + window.scrollY + e.currentTarget.offsetHeight + 5,
      left: rect.left + window.scrollX,
    })
  }
  const handleOptionUpdateSuccess = (oldOptionId, newOption) => {
    updateOption(oldOptionId, newOption)
    setVisibleOption(null)
  }

  const handleQuantityChange = (productOptionId, value) => {
    setQuantities({ ...quantities, [productOptionId]: parseInt(value) })
  }

  const handleQuantityUpdate = (productOptionId) => {
    updateQuantity(productOptionId, quantities[productOptionId] || 1)
    alert('수량이 변경되었습니다!')
  }

  const handleDelete = (ids) => {
    ids.forEach((id) => removeItem(id))
    handleDeleteSelected()
  }

  const totalSelectedPrice = cartItems
    .filter((item) => selectedIds.includes(item.productOptionId))
    .reduce((sum, item) => {
      const price =
        typeof item.productInfo?.discountedPrice === 'number' ? item.productInfo.discountedPrice : 0
      const qty = quantities[item.productOptionId] || 1
      return sum + price * qty
    }, 0)

  const totalShippingFee = selectedIds.length === 0 || totalSelectedPrice < 70000 ? 3000 : 0
  const totalPayment = totalSelectedPrice + totalShippingFee

  return (
    <>
      <CTable align="middle" responsive className="custom-header">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">
              <CFormCheck
                checked={selectedIds.length === cartItems.length}
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
            const info = item.productInfo
            const option = info.productOptions.find(
              (opt) => opt.productOptionId === item.productOptionId,
            )
            return (
              <CTableRow key={item.productOptionId}>
                <CTableDataCell>
                  <CFormCheck
                    checked={selectedIds.includes(item.productOptionId)}
                    onChange={() => handleSelectItem(item.productOptionId)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CImage src={info.thumbnailPath} width={80} />
                </CTableDataCell>
                <CTableDataCell className="text-start">
                  <div>{info.name}</div>
                  <div className="text-muted small">
                    {/* productOptionDetails가 undefined/null이어도 안전하게 처리 */}
                    {option.productOptionDetails
                      ?.map((opt) => `${opt.productOptionType}: ${opt.productOptionDetailName}`)
                      .join(' / ')}
                  </div>

                  {/* productOptionName이 '없음'일 때, 옵션변경 버튼을 숨김 */}
                  {option.productOptionName !== '없음' && (
                    <CButton
                      color="secondary"
                      size="sm"
                      className="mt-1"
                      onClick={(e) => handleOptionChangeClick(e, item.productOptionId)}
                    >
                      옵션변경
                    </CButton>
                  )}

                  {/* 옵션변경 드롭다운 */}
                  {visibleOption?.productOptionId === item.productOptionId && (
                    <OptionChange
                      cartItemId={item.productOptionId}
                      top={visibleOption.top}
                      left={visibleOption.left}
                      productOptions={info.productOptions}
                      selectedOptions={selectedOptions[item.productOptionId] || {}}
                      quantity={quantities[item.productOptionId]}
                      handleSelectOption={(type, value) =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [item.productOptionId]: {
                            ...prev[item.productOptionId],
                            [type]: value,
                          },
                        }))
                      }
                      onUpdateSuccess={(newOption) =>
                        handleOptionUpdateSuccess(item.productOptionId, newOption)
                      }
                      onClose={() => setVisibleOption(null)}
                      isGuest={true}
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
                      value={quantities[item.productOptionId] || 1}
                      onChange={(e) => handleQuantityChange(item.productOptionId, e.target.value)}
                    />
                    <CButton
                      color="secondary"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleQuantityUpdate(item.productOptionId)}
                    >
                      변경
                    </CButton>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  {typeof info.price === 'number'
                    ? (info.price * (quantities[item.productOptionId] || 1)).toLocaleString() + '원'
                    : '가격 없음'}
                </CTableDataCell>
                <CTableDataCell>
                  {typeof info.discountedPrice === 'number' && info.discountedPrice !== info.price
                    ? (
                        info.discountedPrice * (quantities[item.productOptionId] || 1)
                      ).toLocaleString() + '원'
                    : '-'}
                </CTableDataCell>
                <CTableDataCell>
                  {info.discountedPrice * (quantities[item.productOptionId] || 1) >= 70000
                    ? '0원'
                    : '3,000원'}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="danger"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete([item.productOptionId])}
                  >
                    삭제
                  </CButton>
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
            onClick={() => handleDelete(selectedIds)}
          >
            선택상품 삭제
          </CButton>
        </CCol>
        <CCol className="text-end">
          <CButton color="secondary" variant="outline" size="sm" onClick={clearCart}>
            장바구니 비우기
          </CButton>
        </CCol>
      </CRow>

      <CRow className="text-center my-4">
        <CCol>
          <div className="text-muted small">총 상품금액</div>
          <div className="fw-bold">
            {selectedIds.length === 0 ? '-' : totalSelectedPrice.toLocaleString() + '원'}
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">총 배송비</div>
          <div className="fw-bold">
            {selectedIds.length === 0 ? '-' : totalShippingFee.toLocaleString() + '원'}
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">결제예정금액</div>
          <div className="fw-bold">
            {selectedIds.length === 0 ? '-' : totalPayment.toLocaleString() + '원'}
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

export default GuestCartList
