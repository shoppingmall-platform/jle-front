import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CButton,
  CFormInput,
  CFormSelect,
  CBadge,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import { getAllOrders, updateOrderStatus } from "@/apis/order/orderApis";

const OrderList = () => {
  const navigate = useNavigate();

  // 검색 조건
  const [searchConditions, setSearchConditions] = useState({
    orderId: "",
    orderMemberName: "",
    orderMemberId: "",
    orderProductName: "",
    type: "ALL",
    status: "",
    startDate: "",
    endDate: "",
  });

  // 데이터
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 페이징
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 정렬
  const [sortProperty, setSortProperty] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("desc");

  // 상태 변경 중인 주문 ID
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // 주문 조회
  const fetchOrders = async (page = 0, retryCount = 0) => {
    try {
      setLoading(true);

      const requestBody = {
        conditions: {
          orderId: searchConditions.orderId
            ? Number(searchConditions.orderId)
            : undefined,
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
      };

      const response = await getAllOrders(
        requestBody.conditions,
        requestBody.pageable
      );

      setOrders(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("주문 조회 실패:", error);

      // 401 에러이고 재시도 횟수가 3번 미만이면 재시도
      if (error.response?.status === 401 && retryCount < 3) {
        console.log(`🔄 토큰 갱신 후 재시도 (${retryCount + 1}/3)`);
        setTimeout(() => {
          fetchOrders(page, retryCount + 1);
        }, 1000); // 1초 후 재시도
        return;
      }

      alert("주문 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  // 검색
  const handleSearch = () => {
    fetchOrders(0);
  };

  // 초기화
  const handleReset = () => {
    setSearchConditions({
      orderId: "",
      orderMemberName: "",
      orderMemberId: "",
      orderProductName: "",
      type: "ALL",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  // 주문 상태 뱃지 색상
  const getStatusColor = (status) => {
    const colorMap = {
      PAYMENT_COMPLETED: "info",
      SHIPPING: "warning",
      DELIVERED: "success",
      PAYMENT_FAILED: "danger",
      ORDER_CANCELLED: "danger",
    };
    return colorMap[status] || "secondary";
  };

  // 주문 상태 텍스트
  const getStatusText = (status) => {
    const textMap = {
      PAYMENT_COMPLETED: "결제 완료",
      SHIPPING: "배송 중",
      DELIVERED: "배송 완료",
      PAYMENT_FAILED: "결제 실패",
      ORDER_CANCELLED: "주문 취소",
    };
    return textMap[status] || status;
  };

  // 주문 상태 변경
  const handleStatusChange = async (orderId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) {
      return;
    }

    if (
      !confirm(
        `주문 ${orderId}번의 상태를 "${getStatusText(newStatus)}"(으)로 변경하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
      alert("주문 상태가 변경되었습니다.");
      fetchOrders(currentPage); // 현재 페이지 새로고침
    } catch (error) {
      console.error("주문 상태 변경 실패:", error);
      alert("주문 상태 변경에 실패했습니다.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="container mt-4">
      <CRow className="my-4 justify-content-center">
        <h3>주문 조회</h3>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader>주문 정보 조회</CCardHeader>
        <CCardBody>
          <table className="table">
            <tbody>
              <tr>
                <td className="text-center table-header">주문 번호</td>
                <td colSpan="2">
                  <CFormInput
                    type="number"
                    placeholder="주문 번호를 입력하세요"
                    value={searchConditions.orderId}
                    onChange={(e) =>
                      setSearchConditions({
                        ...searchConditions,
                        orderId: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="text-center table-header">주문자명</td>
                <td colSpan="2">
                  <CFormInput
                    placeholder="주문자명을 입력하세요"
                    value={searchConditions.orderMemberName}
                    onChange={(e) =>
                      setSearchConditions({
                        ...searchConditions,
                        orderMemberName: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td className="text-center table-header">주문자 ID</td>
                <td colSpan="2">
                  <CFormInput
                    placeholder="이메일을 입력하세요"
                    value={searchConditions.orderMemberId}
                    onChange={(e) =>
                      setSearchConditions({
                        ...searchConditions,
                        orderMemberId: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="text-center table-header">상품명</td>
                <td colSpan="2">
                  <CFormInput
                    placeholder="상품명을 입력하세요"
                    value={searchConditions.orderProductName}
                    onChange={(e) =>
                      setSearchConditions({
                        ...searchConditions,
                        orderProductName: e.target.value,
                      })
                    }
                  />
                </td>
              </tr>

              <tr>
                <td className="text-center table-header">주문 상태</td>
                <td colSpan="5">
                  <CFormSelect
                    value={searchConditions.status}
                    onChange={(e) =>
                      setSearchConditions({
                        ...searchConditions,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="">전체</option>
                    <option value="PAYMENT_COMPLETED">결제 완료</option>
                    <option value="SHIPPING">배송 중</option>
                    <option value="DELIVERED">배송 완료</option>
                    <option value="PAYMENT_FAILED">결제 실패</option>
                    <option value="ORDER_CANCELLED">주문 취소</option>
                  </CFormSelect>
                </td>
              </tr>

              <tr>
                <td className="text-center table-header">주문 기간</td>
                <td colSpan="5">
                  <div className="d-flex gap-3 align-items-center">
                    <CFormInput
                      type="date"
                      value={searchConditions.startDate}
                      onChange={(e) =>
                        setSearchConditions({
                          ...searchConditions,
                          startDate: e.target.value,
                        })
                      }
                    />
                    <span>~</span>
                    <CFormInput
                      type="date"
                      value={searchConditions.endDate}
                      onChange={(e) =>
                        setSearchConditions({
                          ...searchConditions,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>

      <div className="button-group">
        <CButton color="primary" onClick={handleSearch}>
          검색
        </CButton>
        <CButton color="secondary" variant="outline" onClick={handleReset}>
          초기화
        </CButton>
      </div>

      <CCard className="mb-4">
        <CCardHeader>주문 목록</CCardHeader>
        <CCardBody>
          <div className="body-section">
            <CRow className="align-items-center">
              <CCol md="6">
                <span className="fw-bold">총 {orders?.length || 0}건</span>
              </CCol>
              <CCol md="6" className="d-flex justify-content-end gap-2">
                <CFormSelect
                  size="sm"
                  style={{ width: "auto" }}
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value="10">10개씩 보기</option>
                  <option value="20">20개씩 보기</option>
                  <option value="50">50개씩 보기</option>
                  <option value="100">100개씩 보기</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>

          {loading ? (
            <div className="text-center py-5">로딩 중...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">주문 내역이 없습니다.</div>
          ) : (
            <>
              <CTable>
                <thead className="table-head">
                  <tr>
                    <th>주문번호</th>
                    <th>주문자</th>
                    <th>주문 상품</th>
                    <th>주문 금액</th>
                    <th>주문 상태</th>
                    <th>주문일시</th>
                    <th>상태 변경</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <CTableBody>
                  {orders.map((order) => (
                    <CTableRow key={order.orderId}>
                      <CTableDataCell>{order.orderId}</CTableDataCell>
                      <CTableDataCell>
                        <div>{order.orderMemberName || "-"}</div>
                        <small className="text-muted">
                          {order.orderMemberId || "-"}
                        </small>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {order.orderTitle || order.productName || "-"}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {order.paymentPrice?.toLocaleString() || "0"}원
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusColor(order.orderStatus)}>
                          {getStatusText(order.orderStatus)}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleString("ko-KR")
                          : "-"}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex align-items-center gap-2">
                          <CFormSelect
                            size="sm"
                            style={{ width: "140px" }}
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(
                                order.orderId,
                                order.orderStatus,
                                e.target.value
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
                          onClick={() =>
                            navigate(`/admin/orders/${order.orderId}`)
                          }
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
    </div>
  );
};

export default OrderList;
