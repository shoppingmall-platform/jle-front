import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CAlert,
} from '@coreui/react'
import { getOrderDetail, updateOrderStatus } from '@/apis/order/orderApis'

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  // 주문 상세 조회
  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const data = await getOrderDetail(orderId)
      setOrder(data)
      // 한글 상태를 영어 Enum으로 변환
      setSelectedStatus(convertToEnumStatus(data.orderStatus))
    } catch (error) {
      console.error('주문 상세 조회 실패:', error)
      alert('주문 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  // 주문 상태 변경
  const handleStatusChange = async () => {
    if (selectedStatus === convertToEnumStatus(order.orderStatus)) {
      alert('현재 상태와 동일합니다.')
      return
    }

    if (!confirm(`주문 상태를 "${getStatusText(selectedStatus)}"(으)로 변경하시겠습니까?`)) {
      return
    }

    try {
      setUpdating(true)
      await updateOrderStatus(orderId, selectedStatus)
      alert('주문 상태가 변경되었습니다.')
      fetchOrderDetail() // 새로고침
    } catch (error) {
      console.error('주문 상태 변경 실패:', error)
      alert('주문 상태 변경에 실패했습니다.')
      setSelectedStatus(convertToEnumStatus(order.orderStatus)) // 원래 상태로 되돌림 (Enum 변환)
    } finally {
      setUpdating(false)
    }
  }

  // 주문 상태 뱃지 색상
  const getStatusColor = (status) => {
    const colorMap = {
      PAYMENT_COMPLETED: 'info',
      SHIPPING: 'warning',
      DELIVERED: 'success',
      PAYMENT_FAILED: 'danger',
      ORDER_CANCELLED: 'danger',
    }
    return colorMap[status] || 'secondary'
  }

  // 주문 상태 텍스트
  const getStatusText = (status) => {
    const textMap = {
      PAYMENT_COMPLETED: '결제 완료',
      SHIPPING: '배송 중',
      DELIVERED: '배송 완료',
      PAYMENT_FAILED: '결제 실패',
      ORDER_CANCELLED: '주문 취소',
      // 백엔드가 한글로 보낼 경우 대비
      결제완료: '결제 완료',
      배송중: '배송 중',
      배송완료: '배송 완료',
      결제실패: '결제 실패',
      주문취소: '주문 취소',
    }
    return textMap[status] || status
  }

  // 한글 상태를 영어 Enum으로 변환
  const convertToEnumStatus = (status) => {
    const enumMap = {
      결제완료: 'PAYMENT_COMPLETED',
      배송중: 'SHIPPING',
      배송완료: 'DELIVERED',
      결제실패: 'PAYMENT_FAILED',
      주문취소: 'ORDER_CANCELLED',
    }
    return enumMap[status] || status
  }

  if (loading) {
    return (
      <CContainer className="mt-5">
        <div className="text-center py-5">로딩 중...</div>
      </CContainer>
    )
  }

  if (!order) {
    return (
      <CContainer className="mt-5">
        <div className="text-center py-5">주문 정보를 찾을 수 없습니다.</div>
      </CContainer>
    )
  }

  return (
    <CContainer className="mt-4 mb-5">
      <CRow className="mb-3">
        <CCol>
          <h4>주문 상세 정보</h4>
        </CCol>
        <CCol className="text-end">
          <CButton
            color="secondary"
            variant="outline"
            onClick={() => navigate('/admin/orders/list')}
          >
            목록으로
          </CButton>
        </CCol>
      </CRow>

      {/* 주문 기본 정보 */}
      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">주문 정보</CCardHeader>
        <CCardBody>
          <CRow className="mb-2">
            <CCol md={3}>
              <strong>주문번호</strong>
            </CCol>
            <CCol md={9}>{order.orderId}</CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={3}>
              <strong>주문일시</strong>
            </CCol>
            <CCol md={9}>
              {order.orderDate ? new Date(order.orderDate).toLocaleString('ko-KR') : '-'}
            </CCol>
          </CRow>
          <CRow className="mb-2">
            <CCol md={3}>
              <strong>주문 상품</strong>
            </CCol>
            <CCol md={9}>{order.orderTitle || '-'}</CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* 주문 상태 변경 */}
      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">주문 상태 관리</CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3}>
              <strong>현재 상태</strong>
            </CCol>
            <CCol md={9}>
              <CBadge
                color={getStatusColor(convertToEnumStatus(order.orderStatus))}
                style={{ fontSize: '1rem' }}
              >
                {getStatusText(order.orderStatus)}
              </CBadge>
            </CCol>
          </CRow>

          <CRow className="align-items-end">
            <CCol md={6}>
              <label className="form-label">
                <strong>상태 변경</strong>
              </label>
              <CFormSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={updating}
              >
                <option value="PAYMENT_COMPLETED">결제 완료</option>
                <option value="SHIPPING">배송 중</option>
                <option value="DELIVERED">배송 완료</option>
                <option value="ORDER_CANCELLED">주문 취소</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CButton
                color="primary"
                onClick={handleStatusChange}
                disabled={updating || selectedStatus === convertToEnumStatus(order.orderStatus)}
              >
                {updating ? '변경 중...' : '상태 변경'}
              </CButton>
            </CCol>
          </CRow>

          <CAlert color="info" className="mt-3 mb-0">
            <small>
              💡 <strong>상태 변경 안내:</strong>
              <br />• 결제 완료 → 배송 중 → 배송 완료 순으로 진행됩니다.
              <br />• 주문 취소는 배송 시작 전에만 가능합니다.
            </small>
          </CAlert>
        </CCardBody>
      </CCard>

      {/* 상품 정보 */}
      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">주문 상품</CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>상품명</CTableHeaderCell>
                <CTableHeaderCell>옵션</CTableHeaderCell>
                <CTableHeaderCell className="text-center">수량</CTableHeaderCell>
                <CTableHeaderCell className="text-center">할인</CTableHeaderCell>
                <CTableHeaderCell className="text-end">금액</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {order.products && order.products.length > 0 ? (
                order.products.map((product, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{product.productInfo?.productName || '-'}</CTableDataCell>

                    <CTableDataCell>
                      {product.productInfo?.options && product.productInfo.options.length > 0
                        ? product.productInfo.options.map((opt) => opt.optionName).join(', ')
                        : '-'}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{product.quantity}개</CTableDataCell>
                    <CTableDataCell className="text-center">
                      {product.discountType === 'RATE' && product.discountValue ? (
                        <span className="text-danger">{product.discountValue}% 할인</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell className="text-end">
                      {product.price?.toLocaleString()}원
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    상품 정보가 없습니다.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* 결제 정보 */}
      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">결제 정보</CCardHeader>
        <CCardBody>
          <CRow className="mb-2">
            <CCol xs={6}>
              <span>원래 상품 금액</span>
            </CCol>
            <CCol xs={6} className="text-end">
              {order.originalTotalPrice?.toLocaleString()}원
            </CCol>
          </CRow>

          {order.discountTotalAmount > 0 && (
            <CRow className="mb-2">
              <CCol xs={6}>
                <span className="text-muted">상품 할인</span>
              </CCol>
              <CCol xs={6} className="text-end text-danger">
                -{order.discountTotalAmount.toLocaleString()}원
              </CCol>
            </CRow>
          )}

          {order.couponDiscountAmount > 0 && (
            <CRow className="mb-2">
              <CCol xs={6}>
                <span className="text-muted">쿠폰 할인</span>
              </CCol>
              <CCol xs={6} className="text-end text-danger">
                -{order.couponDiscountAmount.toLocaleString()}원
              </CCol>
            </CRow>
          )}

          {order.pointUsedAmount > 0 && (
            <CRow className="mb-2">
              <CCol xs={6}>
                <span className="text-muted">적립금 사용</span>
              </CCol>
              <CCol xs={6} className="text-end text-danger">
                -{order.pointUsedAmount.toLocaleString()}원
              </CCol>
            </CRow>
          )}

          <CRow className="mb-3">
            <CCol xs={6}>
              <span className="text-muted">배송비</span>
            </CCol>
            <CCol xs={6} className="text-end">
              {order.shippingFee === 0 ? '무료' : `+${order.shippingFee.toLocaleString()}원`}
            </CCol>
          </CRow>

          <hr />

          <CRow>
            <CCol xs={6}>
              <strong>최종 결제 금액</strong>
            </CCol>
            <CCol xs={6} className="text-end">
              <strong className="text-primary fs-5">
                {order.paymentPrice?.toLocaleString()}원
              </strong>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* 배송지 정보 */}
      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">배송지 정보</CCardHeader>
        <CCardBody>
          {order.deliveryInfo ? (
            <>
              <CRow className="mb-2">
                <CCol md={3}>
                  <strong>수령인</strong>
                </CCol>
                <CCol md={9}>{order.deliveryInfo.recipient}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol md={3}>
                  <strong>연락처</strong>
                </CCol>
                <CCol md={9}>{order.deliveryInfo.phone}</CCol>
              </CRow>
              <CRow>
                <CCol md={3}>
                  <strong>주소</strong>
                </CCol>
                <CCol md={9}>{order.deliveryInfo.address}</CCol>
              </CRow>
            </>
          ) : (
            <div className="text-muted">배송지 정보가 없습니다.</div>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default OrderDetail
