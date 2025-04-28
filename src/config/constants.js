// 카테고리 정보
export const CATEGORIES = [
  { name: 'BEST', slug: 'best' },
  { name: 'NEW 5%', slug: 'new' },
  { name: 'OUTER', slug: 'outer' },
  { name: 'TOP', slug: 'top' },
  { name: 'SHIRTS', slug: 'shirts' },
  { name: 'BOTTOM', slug: 'bottom' },
  { name: 'ACC', slug: 'acc' },
  { name: 'SHOES', slug: 'shoes' },
  { name: 'SALE', slug: 'sale' },
]

// 배송비 정책
export const SHIPPING = {
  FREE_SHIPPING_THRESHOLD: 50000, // 5만원 이상 무료배송
  STANDARD_SHIPPING_FEE: 3000, // 기본 배송비 3천원
}

// 적립금 정책
export const POINTS = {
  RATE: 0.01, // 구매금액의 1% 적립
}

// 결제 방법
export const PAYMENT_METHODS = [
  { id: 'card', name: '신용카드' },
  { id: 'bank', name: '무통장입금' },
  { id: 'vbank', name: '가상계좌' },
  { id: 'phone', name: '휴대폰결제' },
  { id: 'kakao', name: '카카오페이' },
  { id: 'naver', name: '네이버페이' },
]

// 주문 상태
export const ORDER_STATUS = {
  PENDING: '결제대기',
  PAID: '결제완료',
  PREPARING: '상품준비중',
  SHIPPING: '배송중',
  DELIVERED: '배송완료',
  CANCELED: '주문취소',
  RETURNED: '반품완료',
  EXCHANGED: '교환완료',
}

// 사이트 정보
export const SITE_INFO = {
  NAME: 'Fashion Shop',
  PHONE: '02-1234-5678',
  EMAIL: 'cs@fashionshop.com',
  ADDRESS: '서울특별시 강남구 테헤란로 123',
  BUSINESS_HOURS: '평일 10:00 - 18:00 (주말 및 공휴일 휴무)',
}
