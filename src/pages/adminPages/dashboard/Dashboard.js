import React, { useState, useEffect } from "react";
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
  CSpinner,
} from "@coreui/react";
import { CChartLine } from "@coreui/react-chartjs";
import {
  getDashboardStats,
  getRecentOrders,
  getOrderTrends,
} from "@/apis/board/dashboardApis";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    todayOrders: 0,
    todayRevenue: 0,
    activeCoupons: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [orderTrends, setOrderTrends] = useState({
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    data: [0, 0, 0, 0, 0, 0, 0],
  });

  // 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // 병렬로 모든 데이터 로드
        const [statsData, ordersData, trendsData] = await Promise.all([
          getDashboardStats().catch((err) => {
            console.error("통계 조회 실패:", err);
            return {
              totalMembers: 0,
              todayOrders: 0,
              todayRevenue: 0,
              activeCoupons: 0,
            };
          }),
          getRecentOrders(5).catch((err) => {
            console.error("최근 주문 조회 실패:", err);
            return [];
          }),
          getOrderTrends(7).catch((err) => {
            console.error("주문 추이 조회 실패:", err);
            return {
              labels: ["월", "화", "수", "목", "금", "토", "일"],
              data: [0, 0, 0, 0, 0, 0, 0],
            };
          }),
        ]);

        setStats(statsData);
        setRecentOrders(ordersData);
        setOrderTrends(trendsData);
      } catch (error) {
        console.error("대시보드 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      결제완료: "success",
      배송중: "info",
      배송완료: "success",
      결제실패: "danger",
      주문취소: "secondary",
    };
    return badges[status] || "secondary";
  };

  return (
    <>
      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
          <div className="mt-2 text-medium-emphasis">데이터 로딩 중...</div>
        </div>
      ) : (
        <>
          <CRow>
            <CCol xs={12}>
              <h2 className="mb-4">대시보드</h2>
            </CCol>
          </CRow>

          {/* 통계 카드 */}
          <CRow>
            <CCol sm={6} lg={3}>
              <CCard
                className="mb-4"
                style={{ borderLeft: "4px solid #321fdb" }}
              >
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-medium-emphasis small mb-1">
                        총 회원
                      </div>
                      <div className="fs-4 fw-semibold">
                        {stats.totalMembers.toLocaleString()}명
                      </div>
                    </div>
                    <div className="fs-1">👥</div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol sm={6} lg={3}>
              <CCard className="mb-4" style={{ borderLeft: "4px solid #39f" }}>
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-medium-emphasis small mb-1">
                        오늘 주문
                      </div>
                      <div className="fs-4 fw-semibold">
                        {stats.todayOrders.toLocaleString()}건
                      </div>
                    </div>
                    <div className="fs-1">🛒</div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol sm={6} lg={3}>
              <CCard
                className="mb-4"
                style={{ borderLeft: "4px solid #2eb85c" }}
              >
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-medium-emphasis small mb-1">
                        오늘 매출
                      </div>
                      <div className="fs-4 fw-semibold">
                        {stats.todayRevenue.toLocaleString()}원
                      </div>
                    </div>
                    <div className="fs-1">💰</div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol sm={6} lg={3}>
              <CCard
                className="mb-4"
                style={{ borderLeft: "4px solid #e55353" }}
              >
                <CCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-medium-emphasis small mb-1">
                        활성 쿠폰
                      </div>
                      <div className="fs-4 fw-semibold">
                        {stats.activeCoupons.toLocaleString()}개
                      </div>
                    </div>
                    <div className="fs-1">🎫</div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* 주문 추이 차트 */}
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>최근 7일 주문 추이</strong>
                </CCardHeader>
                <CCardBody>
                  <CChartLine
                    data={{
                      labels: orderTrends.labels,
                      datasets: [
                        {
                          label: "주문 건수",
                          backgroundColor: "rgba(50, 31, 219, 0.2)",
                          borderColor: "rgba(50, 31, 219, 1)",
                          pointBackgroundColor: "rgba(50, 31, 219, 1)",
                          pointBorderColor: "#fff",
                          data: orderTrends.data,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: true,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 5,
                          },
                        },
                      },
                    }}
                    style={{ height: "300px" }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* 최근 주문 목록 */}
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>최근 주문 내역</strong>
                </CCardHeader>
                <CCardBody>
                  {recentOrders.length === 0 ? (
                    <div className="text-center text-medium-emphasis py-4">
                      최근 주문이 없습니다
                    </div>
                  ) : (
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>주문번호</CTableHeaderCell>
                          <CTableHeaderCell>주문자</CTableHeaderCell>
                          <CTableHeaderCell>상태</CTableHeaderCell>
                          <CTableHeaderCell className="text-end">
                            주문금액
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {recentOrders.map((order) => (
                          <CTableRow key={order.id}>
                            <CTableDataCell>
                              <span className="fw-semibold">
                                {order.orderNumber}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>{order.memberName}</CTableDataCell>
                            <CTableDataCell>
                              <span
                                className={`badge bg-${getStatusBadge(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell className="text-end">
                              {order.amount.toLocaleString()}원
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* 빠른 바로가기 (선택사항) */}
          <CRow>
            <CCol sm={6} lg={3}>
              <CCard
                className="mb-4 text-center"
                style={{ cursor: "pointer" }}
                onClick={() => (window.location.href = "/admin/orders/list")}
              >
                <CCardBody className="py-4">
                  <div className="fs-1 mb-2">📦</div>
                  <div className="fw-semibold">주문 관리</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={6} lg={3}>
              <CCard
                className="mb-4 text-center"
                style={{ cursor: "pointer" }}
                onClick={() => (window.location.href = "/admin/products/list")}
              >
                <CCardBody className="py-4">
                  <div className="fs-1 mb-2">🏷️</div>
                  <div className="fw-semibold">상품 관리</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={6} lg={3}>
              <CCard
                className="mb-4 text-center"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  (window.location.href = "/admin/promotion/coupons/add")
                }
              >
                <CCardBody className="py-4">
                  <div className="fs-1 mb-2">🎫</div>
                  <div className="fw-semibold">쿠폰 등록</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={6} lg={3}>
              <CCard
                className="mb-4 text-center"
                style={{ cursor: "pointer" }}
                onClick={() => (window.location.href = "/admin/customers/list")}
              >
                <CCardBody className="py-4">
                  <div className="fs-1 mb-2">👥</div>
                  <div className="fw-semibold">회원 관리</div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  );
};

export default Dashboard;
