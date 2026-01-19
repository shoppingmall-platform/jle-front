import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CFormInput,
  CFormSelect,
  CBadge,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { getAllOrders, updateOrderStatus } from '@/apis/order/orderApis'

const OrderList = () => {
  const navigate = useNavigate()

  // 검색 조건
  const [searchConditions, setSearchConditions] = useState({
    orderId: '',
    orderMemberName: '',
    orderMemberId: '',
    orderProductName: '',
    type: 'ALL',
    status: '',
    startDate: '',
    endDate: '',
  })

  // 데이터
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  // 페이징
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // 정렬
  const [sortProperty, setSortProperty] = useState('orderDate')
  const [sortDirection, setSortDirection] = useState('desc')

  // 상태 변경 중인 주문 ID
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  // 주문 조회
  const fetchOrders = async (page = 0, retryCount = 0) => {
    try {
      setLoading(true)

      const requestBody = {
        conditions: {
          orderId: searchConditions.orderId ? Number(searchConditions.orderId) : undefined,
          orderMemberName: searchConditions.orderMemberName || undefined,
          orderMemberId: searchConditions.orderMemberId || undefined,
          orderProductName: searchConditions.orderProductName || undefined,
          type: searchConditions.type,
          status: searchConditions.status || undefined,
          startDate: searchConditions.startDate || undefined,
          endDate: searchConditions.endDate || undefined,
        },
        pageable: {
          page: page,
          size: pageSize,
          sort: {
            property: sortProperty,
            direction: sortDirection,
          },
        },
      }

      const response = await getAllOrders(requestBody.conditions, requestBody.pageable)

      setOrders(response.content || [])
      setTotalPages(response.totalPages || 0)
      setCurrentPage(page)
    } catch (error) {
      console.error('주문 조회 실패:', error)

      // 401 에러이고 재시도 횟수가 3번 미만이면 재시도
      if (error.response?.status === 401 && retryCount < 3) {
        console.log(`🔄 토큰 갱신 후 재시도 (${retryCount + 1}/3)`)
        setTimeout(() => {
          fetchOrders(page, retryCount + 1)
        }, 1000) // 1초 후 재시도
        return
      }

      alert('주문 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(0)
  }, [])

  // 검색
  const handleSearch = () => {
    fetchOrders(0)
  }

  // 초기화
  const handleReset = () => {
    setSearchConditions({
      orderId: '',
      orderMemberName: '',
      orderMemberId: '',
      orderProductName: '',
      type: 'ALL',
      status: '',
      startDate: '',
      endDate: '',
    })
  }

  // 페이지 변경
  const handlePageChange = (page) => {
    fetchOrders(page)
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
    }
    return textMap[status] || status
  }

  // 주문 상태 변경
  const handleStatusChange = async (orderId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) {
      return
    }

    if (
      !confirm(`주문 ${orderId}번의 상태를 "${getStatusText(newStatus)}"(으)로 변경하시겠습니까?`)
    ) {
      return
    }

    try {
      setUpdatingOrderId(orderId)
      await updateOrderStatus(orderId, newStatus)
      alert('주문 상태가 변경되었습니다.')
      fetchOrders(currentPage) // 현재 페이지 새로고침
    } catch (error) {
      console.error('주문 상태 변경 실패:', error)
      alert('주문 상태 변경에 실패했습니다.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>주문 검색</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={3}>
                  <label className="form-label">주문 번호</label>
                  <CFormInput
                    type="number"
                    placeholder="주문 번호"
                    value={searchConditions.orderId}
                    onChange={(e) =>
                      setSearchConditions({ ...searchConditions, orderId: e.target.value })
                    }
                  />
                </CCol>
                <CCol md={3}>
                  <label className="form-label">주문자명</label>
                  <CFormInput
                    placeholder="주문자명"
                    value={searchConditions.orderMemberName}
                    onChange={(e) =>
                      setSearchConditions({ ...searchConditions, orderMemberName: e.target.value })
                    }
                  />
                </CCol>
                <CCol md={3}>
                  <label className="form-label">주문자 ID (이메일)</label>
                  <CFormInput
                    placeholder="이메일"
                    value={searchConditions.orderMemberId}
                    onChange={(e) =>
                      setSearchConditions({ ...searchConditions, orderMemberId: e.target.value })
                    }
                  />
                </CCol>
                <CCol md={3}>
                  <label className="form-label">상품명</label>
                  <CFormInput
                    placeholder="상품명"
                    value={searchConditions.orderProductName}
                    onChange={(e) =>
                      setSearchConditions({ ...searchConditions, orderProductName: e.target.value })
                    }
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={3}>
                  <label className="form-label">주문 상태</label>
                  <CFormSelect
                    value={searchConditions.status}
                    onChange={(e) =>
                      setSearchConditions({ ...searchConditions, status: e.target.value })
                    }
                  >
                    <option value="">전체</option>
                    <option value="PAYMENT_COMPLETED">결제 완료</option>
                    <option value="SHIPPING">배송 중</option>
                    <option value="DELIVERED">배송 완료</option>
                    <option value="PAYMENT_FAILED">결제 실패</option>
                    <option value="ORDER_CANCELLED">주문 취소</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <label className="form-label">시작일</label>
                  <CFormInput
                    type="date"
                    value={searchConditions.startDate}
                    onChange={(e) =>
                      setSearchConditions({ ...searchConditions, startDate: e.target.value })
                    }
                  />
                </CCol>
                <CCol md={3}>
                  <label className="form-label">종료일</label>
                  <CFormInput
                    type="date"
                    value={searchConditions.endDate}
                    onChange={(e) =>
                      setSearchConditions({ ...searchConditions, endDate: e.target.value })
                    }
                  />
                </CCol>
                <CCol md={3}>
                  <label className="form-label">페이지 크기</label>
                  <CFormSelect
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value="10">10개씩</option>
                    <option value="20">20개씩</option>
                    <option value="50">50개씩</option>
                    <option value="100">100개씩</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow>
                <CCol className="d-flex gap-2">
                  <CButton color="primary" onClick={handleSearch}>
                    검색
                  </CButton>
                  <CButton color="secondary" variant="outline" onClick={handleReset}>
                    초기화
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>주문 목록</strong>
              <span className="ms-2 text-muted">
                (총 {orders.length}건 / {totalPages}페이지)
              </span>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center py-5">로딩 중...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5">주문 내역이 없습니다.</div>
              ) : (
                <>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>주문번호</CTableHeaderCell>
                        <CTableHeaderCell>주문자</CTableHeaderCell>
                        <CTableHeaderCell>주문 상품</CTableHeaderCell>
                        <CTableHeaderCell>주문 금액</CTableHeaderCell>
                        <CTableHeaderCell>주문 상태</CTableHeaderCell>
                        <CTableHeaderCell>주문일시</CTableHeaderCell>
                        <CTableHeaderCell>상태 변경</CTableHeaderCell>
                        <CTableHeaderCell>관리</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {orders.map((order) => (
                        <CTableRow key={order.orderId}>
                          <CTableDataCell>{order.orderId}</CTableDataCell>
                          <CTableDataCell>
                            <div>{order.orderMemberName || '-'}</div>
                            <small className="text-muted">{order.orderMemberId || '-'}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{order.orderTitle || order.productName || '-'}</div>
                          </CTableDataCell>
                          <CTableDataCell>
                            {order.paymentPrice?.toLocaleString() || '0'}원
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getStatusColor(order.orderStatus)}>
                              {getStatusText(order.orderStatus)}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            {order.orderDate
                              ? new Date(order.orderDate).toLocaleString('ko-KR')
                              : '-'}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center gap-2">
                              <CFormSelect
                                size="sm"
                                style={{ width: '140px' }}
                                value={order.orderStatus}
                                onChange={(e) =>
                                  handleStatusChange(
                                    order.orderId,
                                    order.orderStatus,
                                    e.target.value,
                                  )
                                }
                                disabled={updatingOrderId === order.orderId}
                              >
                                <option value="PAYMENT_COMPLETED">결제 완료</option>
                                <option value="SHIPPING">배송 중</option>
                                <option value="DELIVERED">배송 완료</option>
                                <option value="ORDER_CANCELLED">주문 취소</option>
                              </CFormSelect>
                              {updatingOrderId === order.orderId && (
                                <small className="text-muted">변경 중...</small>
                              )}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                            >
                              상세
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <CPagination align="center" className="mt-3">
                      <CPaginationItem
                        disabled={currentPage === 0}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        이전
                      </CPaginationItem>

                      {[...Array(totalPages)].map((_, index) => (
                        <CPaginationItem
                          key={index}
                          active={index === currentPage}
                          onClick={() => handlePageChange(index)}
                        >
                          {index + 1}
                        </CPaginationItem>
                      ))}

                      <CPaginationItem
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        다음
                      </CPaginationItem>
                    </CPagination>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default OrderList
