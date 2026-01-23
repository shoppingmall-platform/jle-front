import { useApi } from "@/apis/index";

const api = useApi();

/**
 * 대시보드 통계 조회
 * 기존 API들을 조합해서 통계 데이터 생성
 */
export const getDashboardStats = async () => {
  try {
    // 1. 총 회원 수
    const memberResponse = await api.post("/member/v1/members/search", {});
    const totalMembers = Array.isArray(memberResponse.data)
      ? memberResponse.data.length
      : 0;

    // 2. 오늘 주문 & 오늘 매출
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const orderResponse = await api.post("/order/v1/admin/orders/search", {
      conditions: {
        startDate: todayStr,
        endDate: todayStr,
      },
      pageable: {
        page: 0,
        size: 1000,
      },
    });

    const todayOrders = orderResponse.data?.content || [];
    const todayOrderCount = todayOrders.length;
    const todayRevenue = todayOrders.reduce((sum, order) => {
      return (
        sum +
        (order.totalPrice ||
          order.finalAmount ||
          order.totalAmount ||
          order.amount ||
          0)
      );
    }, 0);

    // 3. 활성 쿠폰 수
    const couponResponse = await api.post("/member/v1/coupons/search", {
      couponName: "",
      couponStartDate: null,
      couponEndDate: null,
    });

    const allCoupons = couponResponse.data || [];
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const activeCoupons = allCoupons.filter((coupon) => {
      const endDate = new Date(coupon.couponEndDate);
      endDate.setHours(23, 59, 59, 999);
      return endDate >= todayDate;
    });

    return {
      totalMembers,
      todayOrders: todayOrderCount,
      todayRevenue,
      activeCoupons: activeCoupons.length,
    };
  } catch (error) {
    console.error("❌ 대시보드 통계 조회 실패:", error);
    throw error;
  }
};

/**
 * 최근 주문 조회
 * @param {number} limit - 조회할 주문 개수
 */
export const getRecentOrders = async (limit = 5) => {
  try {
    // ⚠️ 백엔드 정렬이 안 먹히므로 많이 가져와서 프론트에서 정렬
    const response = await api.post("/order/v1/admin/orders/search", {
      conditions: {},
      pageable: {
        page: 0,
        size: 100, // ⭐ 일단 100개 가져오기
        sort: {
          property: "orderId",
          direction: "desc",
        },
      },
      direction: "DESC",
      sortBy: "orderId",
    });

    const orders = response.data?.content || [];

    // ⭐ 프론트에서 정렬 후 limit만큼만 자르기
    const sortedOrders = orders
      .sort((a, b) => b.orderId - a.orderId)
      .slice(0, limit);

    // 응답 포맷 변환
    return sortedOrders.map((order) => {
      return {
        id: order.orderId,
        orderNumber: order.orderNumber || `ORD-${order.orderId}`,
        memberName:
          order.orderMemberName ||
          order.memberName ||
          order.memberLoginId ||
          order.loginId ||
          "비회원",
        status: formatOrderStatus(order.status || order.orderStatus),
        amount:
          order.totalPrice ||
          order.finalAmount ||
          order.totalAmount ||
          order.amount ||
          0,
        createdAt: order.orderDate || order.createdAt,
      };
    });
  } catch (error) {
    console.error("❌ 최근 주문 조회 실패:", error);
    throw error;
  }
};

/**
 * 최근 7일 주문 추이
 */
export const getOrderTrends = async (days = 7) => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const response = await api.post("/order/v1/admin/orders/search", {
      conditions: {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      },
      pageable: {
        page: 0,
        size: 1000,
      },
    });

    const orders = response.data?.content || [];

    // 날짜별로 그룹핑
    const ordersByDate = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      ordersByDate[dateStr] = 0;
    }

    orders.forEach((order) => {
      const orderDate = order.orderDate ? order.orderDate.split(" ")[0] : null; // ⭐ '2026-01-20 07:43:47' → '2026-01-20'
      if (orderDate && ordersByDate.hasOwnProperty(orderDate)) {
        ordersByDate[orderDate]++;
      }
    });

    // 차트용 데이터 포맷
    const labels = [];
    const data = [];
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    Object.keys(ordersByDate)
      .sort()
      .forEach((dateStr) => {
        const date = new Date(dateStr);
        labels.push(dayNames[date.getDay()]);
        data.push(ordersByDate[dateStr]);
      });

    return { labels, data };
  } catch (error) {
    console.error("주문 추이 조회 실패:", error);
    // 에러 시 빈 데이터 반환
    return {
      labels: ["월", "화", "수", "목", "금", "토", "일"],
      data: [0, 0, 0, 0, 0, 0, 0],
    };
  }
};

/**
 * 주문 상태 한글 변환
 */
const formatOrderStatus = (status) => {
  const statusMap = {
    PAYMENT_COMPLETED: "결제완료",
    SHIPPING: "배송중",
    DELIVERED: "배송완료",
    PAYMENT_FAILED: "결제실패",
    ORDER_CANCELLED: "주문취소",
  };
  return statusMap[status] || status;
};

export default {
  getDashboardStats,
  getRecentOrders,
  getOrderTrends,
};
