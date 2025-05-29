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

const GuestCartList = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useGuestCartStore()

  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.productOptionId] = item.quantity
      return acc
    }, {}),
  )

  const {
    selectedItems: selectedIds,
    handleSelectAll,
    handleSelectItem,
    handleDeleteSelected,
  } = useCheckboxSelection(cartItems, 'productOptionId')

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
    .reduce((sum, item) => sum + item.discountedPrice * (quantities[item.productOptionId] || 1), 0)

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
            <CTableHeaderCell>이미지</CTableHeaderCell>
            <CTableHeaderCell>상품정보</CTableHeaderCell>
            <CTableHeaderCell>수량</CTableHeaderCell>
            <CTableHeaderCell>상품금액</CTableHeaderCell>
            <CTableHeaderCell>배송비</CTableHeaderCell>
            <CTableHeaderCell>선택</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {cartItems.map((item) => (
            <CTableRow key={item.productOptionId}>
              <CTableDataCell>
                <CFormCheck
                  checked={selectedIds.includes(item.productOptionId)}
                  onChange={() => handleSelectItem(item.productOptionId)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CImage src={item.thumbnailPath} width={80} />
              </CTableDataCell>
              <CTableDataCell className="text-start">
                <div>{item.name}</div>
                <div className="text-muted small">
                  {item.productOptionDetails
                    .map((opt) => `${opt.productOptionType}: ${opt.productOptionDetailName}`)
                    .join(' / ')}
                </div>
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
              <CTableDataCell>{item.discountedPrice.toLocaleString()}원</CTableDataCell>
              <CTableDataCell>{item.discountedPrice >= 70000 ? '0원' : '3,000원'}</CTableDataCell>
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
          ))}
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
    </>
  )
}

export default GuestCartList
