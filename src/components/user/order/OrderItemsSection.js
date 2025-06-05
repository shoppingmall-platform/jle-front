// src/components/order/OrderItemsSection.jsx
import React, { useEffect } from 'react'
import { CRow, CCol, CCard, CCardBody, CCardHeader, CImage } from '@coreui/react'

const OrderItemsSection = ({ orderItems = [], onItemsDiscountChange }) => {
  // 1) orderItems 배열이 바뀔 때마다 “상품별 할인합” 계산 후 부모 콜백 호출
  useEffect(() => {
    const sumDiscount = orderItems.reduce((sum, item) => {
      const info = item.productOptionInfo.productInfo
      const original = info.price || 0
      const discounted = info.discountedPrice || 0
      const qty = item.quantity || 1
      return sum + (original - discounted) * qty
    }, 0)

    onItemsDiscountChange && onItemsDiscountChange(sumDiscount)
  }, [orderItems])

  // 2) 렌더링: orderItems가 비어 있으면 별도 메시지, 아니면 카드 형태로 나열
  if (!orderItems || orderItems.length === 0) {
    return <div className="text-center text-muted py-4">주문할 상품이 없습니다.</div>
  }

  return (
    <div style={{ padding: '1rem' }}>
      <CRow className="g-3">
        {orderItems.map((item) => {
          const { cartItemId, productOptionInfo, quantity } = item
          const { productInfo, productOptionId } = productOptionInfo

          const originalPrice = productInfo.price || 0
          const discountedPrice = productInfo.discountedPrice || 0
          const itemDiscount = (originalPrice - discountedPrice) * (quantity || 1)

          const optionObj = productInfo.productOptions.find(
            (opt) => opt.productOptionId === productOptionId,
          )
          const optionDetails = (optionObj?.productOptionDetails || [])
            .map((d) => `${d.productOptionType}: ${d.productOptionDetailName}`)
            .join(' / ')

          return (
            <CCol key={cartItemId} xs={12}>
              <CCard>
                <CCardHeader>
                  <span style={{ fontWeight: '500' }}>상품 #{productInfo.productId}</span>
                </CCardHeader>
                <CCardBody style={{ display: 'flex', gap: '1rem' }}>
                  <CImage
                    src={productInfo.thumbnailPath}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: '500' }}>{productInfo.name}</div>
                    <div className="text-muted small" style={{ margin: '0.25rem 0' }}>
                      옵션: {optionObj?.productOptionName || 'N/A'}
                    </div>
                    {optionDetails && (
                      <div className="text-muted small" style={{ marginBottom: '0.25rem' }}>
                        ({optionDetails})
                      </div>
                    )}

                    <div style={{ marginBottom: '0.25rem' }}>수량: {quantity}개</div>

                    {/* ───── 상품 가격, 할인 정보 ───── */}
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      <span style={{ textDecoration: 'line-through', color: '#999' }}>
                        {originalPrice.toLocaleString()}원
                      </span>{' '}
                      →{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {discountedPrice.toLocaleString()}원
                      </span>
                    </div>
                    {itemDiscount > 0 && (
                      <div style={{ fontSize: '0.9rem', color: '#d9534f' }}>
                        할인금액: {itemDiscount.toLocaleString()}원
                      </div>
                    )}
                    {/* ───────────────────────────── */}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          )
        })}
      </CRow>
    </div>
  )
}

export default OrderItemsSection
