import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@coreui/react";
import { getMyOrderDetail, cancelOrder } from "@/apis/order/orderApis";

const MyOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        console.log("📦 주문 상세 조회:", orderId);
        const response = await getMyOrderDetail(orderId);
        console.log("✅ 주문 상세 응답:", response);
        setOrder(response);
      } catch (error) {
        console.error("❌ 주문 상세 조회 실패:", error);
        alert("주문 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  if (loading) {
    return (
      <CContainer className="my-order-detail mt-5 mb-5">
        <div className="text-center py-5">로딩 중...</div>
      </CContainer>
    );
  }

  if (!order) {
    return (
      <CContainer className="my-order-detail mt-5 mb-5">
        <div className="text-center py-5">주문 정보를 찾을 수 없습니다.</div>
      </CContainer>
    );
  }

  // 주문 상태 뱃지 색상
  const getStatusColor = (status) => {
    const statusMap = {
      PAYMENT_COMPLETED: "info",
      SHIPPING: "warning",
      DELIVERED: "success",
      PAYMENT_FAILED: "danger",
      ORDER_CANCELLED: "danger",
    };
    return statusMap[status] || "secondary";
  };

  // 주문 상태 텍스트 변환
  const getOrderStatusText = (status) => {
    const statusMap = {
      PAYMENT_COMPLETED: "결제 완료",
      SHIPPING: "배송 중",
      DELIVERED: "배송 완료",
      PAYMENT_FAILED: "결제 실패",
      ORDER_CANCELLED: "주문 취소",
    };
    return statusMap[status] || status;
  };

  // 주문 취소 가능 여부 확인
  const canCancelOrder = () => {
    if (!order) return false;

    // orderStatus가 PAYMENT_COMPLETED이고
    // deliveryStatus가 배송 중 이전이면 취소 가능
    const isPaymentCompleted = order.orderStatus === "결제 완료";
    const notShipping = !["SHIPPING", "DELIVERED"].includes(order.orderStatus);

    return isPaymentCompleted && notShipping;
  };

  // 주문 취소 처리
  const handleCancelOrder = async () => {
    if (!confirm("정말 주문을 취소하시겠습니까?")) {
      return;
    }

    try {
      setCancelling(true);
      await cancelOrder(orderId);
      alert("주문이 취소되었습니다.");
      navigate("/mypage/orders"); // 주문 목록으로 이동
    } catch (error) {
      console.error("주문 취소 실패:", error);
      alert(
        "주문 취소에 실패했습니다: " + (error.message || "알 수 없는 오류")
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <CContainer
      className="my-order-detail mt-5 mb-5"
      style={{ maxWidth: "900px" }}
    >
      {/* 헤더 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{order.orderTitle}</h4>
        <CBadge
          color={getStatusColor(order.orderStatus)}
          className="fs-6 px-3 py-2"
        >
          {order.orderStatus}
        </CBadge>
      </div>

      <div className="text-muted mb-4">
        <small>주문일자: {order.orderDate}</small>
      </div>

      {/* 주문 상품 */}
      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">주문 상품</CCardHeader>
        <CCardBody>
          {/* ========== PC 버전 (테이블) ========== */}
          <div className="d-none d-md-block">
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style={{ width: "50%" }}>
                    상품명
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    style={{ width: "15%" }}
                  >
                    수량
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-center"
                    style={{ width: "20%" }}
                  >
                    할인
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-end"
                    style={{ width: "15%" }}
                  >
                    금액
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {order.products &&
                  order.products.map((product, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>
                        <div>
                          <strong>{product.productInfo.productName}</strong>
                        </div>
                        {product.productInfo.options &&
                          product.productInfo.options.length > 0 && (
                            <div className="text-muted small">
                              {product.productInfo.options
                                .map((opt) => opt.optionName)
                                .join(" / ")}
                            </div>
                          )}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {product.quantity}개
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {product.discountType === "AMOUNT" &&
                          product.discountValue > 0 && (
                            <span className="text-danger">
                              -{product.discountValue.toLocaleString()}원
                            </span>
                          )}
                        {product.discountType === "RATE" &&
                          product.discountValue > 0 && (
                            <span className="text-danger">
                              -{product.discountValue}%
                            </span>
                          )}
                        {(!product.discountType ||
                          product.discountValue === 0) && (
                          <span className="text-muted">-</span>
                        )}
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        {product.price?.toLocaleString()}원
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
          </div>

          {/* ========== 모바일 버전 (카드) ========== */}
          <div className="d-block d-md-none">
            {order.products && order.products.length > 0 ? (
              order.products.map((product, idx) => (
                <CCard key={idx} className="mb-3 border">
                  <CCardBody className="p-3">
                    <div className="fw-bold mb-1">
                      {product.productInfo.productName}
                    </div>
                    {product.productInfo.options &&
                      product.productInfo.options.length > 0 && (
                        <div className="text-muted small mb-2">
                          {product.productInfo.options
                            .map((opt) => opt.optionName)
                            .join(" / ")}
                        </div>
                      )}

                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="small">
                        <span className="text-muted">수량:</span>{" "}
                        {product.quantity}개
                      </div>
                      <div className="small">
                        {product.discountType === "AMOUNT" &&
                          product.discountValue > 0 && (
                            <span className="text-danger">
                              할인: -{product.discountValue.toLocaleString()}원
                            </span>
                          )}
                        {product.discountType === "RATE" &&
                          product.discountValue > 0 && (
                            <span className="text-danger">
                              할인: -{product.discountValue}%
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="text-end mt-2">
                      <strong className="text-primary">
                        {product.price?.toLocaleString()}원
                      </strong>
                    </div>
                  </CCardBody>
                </CCard>
              ))
            ) : (
              <div className="text-center text-muted">
                주문 상품이 없습니다.
              </div>
            )}
          </div>
        </CCardBody>
      </CCard>

      {/* 결제 정보 */}
      <CCard className="mb-4">
        <CCardHeader className="fw-semibold">결제 정보</CCardHeader>
        <CCardBody>
          {/* 1. 원래 상품 금액 (할인 전) */}
          <CRow className="mb-2">
            <CCol xs={6}>
              <span>원래 상품 금액</span>
            </CCol>
            <CCol xs={6} className="text-end">
              {order.originalTotalPrice?.toLocaleString()}원
            </CCol>
          </CRow>

          {/* 2. 상품 할인 */}
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

          {/* 3. 쿠폰 할인 */}
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

          {/* 4. 포인트 사용 */}
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

          {/* 5. 배송비 */}
          <CRow className="mb-3">
            <CCol xs={6}>
              <span className="text-muted">배송비</span>
            </CCol>
            <CCol xs={6} className="text-end">
              {order.shippingFee === 0
                ? "무료"
                : `+${order.shippingFee.toLocaleString()}원`}
            </CCol>
          </CRow>

          <hr />

          {/* 6. 최종 결제 금액 */}
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
                <CCol xs={3}>
                  <strong>수령인</strong>
                </CCol>
                <CCol xs={9}>{order.deliveryInfo.recipient}</CCol>
              </CRow>
              <CRow className="mb-2">
                <CCol xs={3}>
                  <strong>연락처</strong>
                </CCol>
                <CCol xs={9}>{order.deliveryInfo.phone}</CCol>
              </CRow>
              <CRow>
                <CCol xs={3}>
                  <strong>주소</strong>
                </CCol>
                <CCol xs={9}>{order.deliveryInfo.address}</CCol>
              </CRow>
            </>
          ) : (
            <div className="text-muted">배송지 정보가 없습니다.</div>
          )}
        </CCardBody>
      </CCard>

      {/* 버튼 */}
      <div className="d-flex justify-content-between mb-4">
        <CButton
          color="secondary"
          variant="outline"
          onClick={() => navigate("/mypage/orders")}
        >
          목록으로
        </CButton>

        <div className="d-flex gap-2">
          {/* 주문 취소 버튼 - PAYMENT_COMPLETED 상태이고 배송 시작 전 */}
          {canCancelOrder() && (
            <CButton
              color="danger"
              variant="outline"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? "취소 중..." : "주문 취소"}
            </CButton>
          )}

          {/* 배송 완료 후 교환/반품 */}
          {order.orderStatus === "DELIVERED" && (
            <>
              <CButton color="warning" variant="outline">
                교환 신청
              </CButton>
              <CButton color="danger" variant="outline">
                반품 신청
              </CButton>
            </>
          )}
        </div>
      </div>
    </CContainer>
  );
};

export default MyOrderDetail;
