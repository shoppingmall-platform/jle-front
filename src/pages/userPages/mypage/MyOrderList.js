import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CBadge,
} from '@coreui/react'
import { getMyOrders, cancelOrder } from '@/apis/order/orderApis'

const MyOrderList = () => {
  const navigate = useNavigate()

  // 필터 상태
  const [period, setPeriod] = useState('1month')
  const [orderType, setOrderType] = useState('전체')
  const [deliveryStatus, setDeliveryStatus] = useState(null)

  // 데이터 상태
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [cancellingOrderId, setCancellingOrderId] = useState(null)

  // 주문 조회
  const fetchOrders = async (pageNum = 0) => {
    try {
      setLoading(true)

      // 기간 계산
      const endDate = new Date()
      const startDate = new Date()

      switch (period) {
        case '1month':
          startDate.setMonth(startDate.getMonth() - 1)
          break
        case '3months':
          startDate.setMonth(startDate.getMonth() - 3)
          break
        case '6months':
          startDate.setMonth(startDate.getMonth() - 6)
          break
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
        case 'all':
          startDate.setFullYear(2000, 0, 1)
          break
        default:
          startDate.setMonth(startDate.getMonth() - 1)
      }

      // 한글 타입 → Enum 변환
      const typeMap = {
        전체: 'ALL',
        '취소/반품/교환': 'CANCEL_RETURN_EXCHANGE',
      }

      const params = {
        conditions: {
          type: typeMap[orderType] || 'ALL',
          status: deliveryStatus,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
        pageable: {
          page: pageNum,
          size: 10,
          sort: {
            direction: 'desc',
            properties: ['orderDate'],
          },
        },
      }

      console.log('📦 주문 목록 조회:', params)
      const response = await getMyOrders(params)
      console.log('✅ 주문 목록 응답:', response)

      setOrders(response.content || [])
      setPage(response.page || 0)
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      console.error('❌ 주문 목록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(0)
  }, [period, orderType, deliveryStatus])

  // 주문 상태 뱃지 색상
  const getStatusColor = (status) => {
    const statusMap = {
      PAYMENT_COMPLETED: 'info',
      SHIPPING: 'warning',
      DELIVERED: 'success',
      PAYMENT_FAILED: 'danger',
      ORDER_CANCELLED: 'danger',
      결제대기: 'warning',
      결제완료: 'info',
      배송준비중: 'primary',
      배송중: 'warning',
      배송완료: 'success',
      취소: 'danger',
      반품: 'danger',
      교환: 'secondary',
    }
    return statusMap[status] || 'secondary'
  }

  // 취소 가능 여부
  const canCancelOrder = (orderStatus) => {
    return orderStatus === 'PAYMENT_COMPLETED'
  }

  // 주문 취소 처리
  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지

    if (!confirm('정말 주문을 취소하시겠습니까?')) {
      return
    }

    try {
      setCancellingOrderId(orderId)
      await cancelOrder(orderId)
      alert('주문이 취소되었습니다.')
      fetchOrders(page) // 목록 새로고침
    } catch (error) {
      console.error('주문 취소 실패:', error)
      alert('주문 취소에 실패했습니다: ' + (error.message || '알 수 없는 오류'))
    } finally {
      setCancellingOrderId(null)
    }
  }

  return (
    <CContainer className="my-order-list mt-5 mb-5">
      <h4 className="mb-4 text-center">주문 내역</h4>

      {/* 필터 */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={4}>
              <label className="form-label">조회 기간</label>
              <CFormSelect value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="1month">1개월</option>
                <option value="3months">3개월</option>
                <option value="6months">6개월</option>
                <option value="1year">1년</option>
                <option value="all">전체</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <label className="form-label">주문 구분</label>
              <CFormSelect value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="전체">전체</option>
                <option value="취소/반품/교환">취소/반품/교환</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <label className="form-label">배송 상태</label>
              <CFormSelect
                value={deliveryStatus || ''}
                onChange={(e) => setDeliveryStatus(e.target.value || null)}
              >
                <option value="">전체</option>
                <option value="배송준비중">배송준비중</option>
                <option value="배송중">배송중</option>
                <option value="배송완료">배송완료</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* 주문 목록 */}
      {loading ? (
        <div className="text-center py-5">로딩 중...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5">
          <p>주문 내역이 없습니다.</p>
        </div>
      ) : (
        <>
          {orders.map((order) => (
            <CCard key={order.orderId} className="order-card mb-3">
              <CCardBody>
                <CRow className="align-items-center">
                  {/* 주문 정보 */}
                  <CCol md={8}>
                    <div className="order-date mb-2">
                      <small className="text-muted">주문일자: {order.orderDate}</small>
                    </div>
                    <h6 className="mb-2">
                      {order.mainProductName}
                      {order.productCount > 1 && ` 외 ${order.productCount - 1}건`}
                    </h6>

                    {/* 상품 목록 (최대 2개) */}
                    {order.products && order.products.length > 0 && (
                      <div className="product-list">
                        {order.products.slice(0, 2).map((product, idx) => (
                          <div key={idx} className="product-item">
                            <span className="product-name">{product.productName}</span>
                            {product.optionName && (
                              <span className="product-option"> / {product.optionName}</span>
                            )}
                            <span className="product-quantity"> × {product.quantity}</span>
                            <CBadge
                              color={getStatusColor(product.orderProductStatus)}
                              className="ms-2"
                            >
                              {product.orderProductStatus}
                            </CBadge>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <small className="text-muted">외 {order.products.length - 2}개</small>
                        )}
                      </div>
                    )}
                  </CCol>

                  {/* 금액 및 버튼 */}
                  <CCol md={4} className="text-end">
                    <div className="order-amount mb-3">
                      <strong className="fs-5">
                        {order.paymentAmount?.toLocaleString() || '0'}원
                      </strong>
                    </div>
                    <div className="d-flex gap-2 justify-content-end">
                      {/* 취소 버튼 - PAYMENT_COMPLETED 상태만 */}
                      {canCancelOrder(order.orderStatus) && (
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleCancelOrder(order.orderId, e)}
                          disabled={cancellingOrderId === order.orderId}
                        >
                          {cancellingOrderId === order.orderId ? '취소 중...' : '주문 취소'}
                        </CButton>
                      )}
                      <CButton
                        color="dark"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/mypage/orders/${order.orderId}`)}
                      >
                        상세보기
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          ))}

          {/* 페이지네이션 */}
          <div className="d-flex justify-content-center gap-2 mt-4">
            <CButton
              color="secondary"
              variant="outline"
              disabled={page === 0}
              onClick={() => fetchOrders(page - 1)}
            >
              이전
            </CButton>
            <span className="d-flex align-items-center px-3">
              {page + 1} / {totalPages}
            </span>
            <CButton
              color="secondary"
              variant="outline"
              disabled={page >= totalPages - 1}
              onClick={() => fetchOrders(page + 1)}
            >
              다음
            </CButton>
          </div>
        </>
      )}
    </CContainer>
  )
}

export default MyOrderList
