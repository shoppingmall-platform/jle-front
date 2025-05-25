// 인증없이 접근가능 페이지
export const AUTH_EXCLUSIONS_ROUTER_NAME = [
  /* 로그인 없이 접근 가능 */
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/products',
  '/products/:id',
  /* TODO: 관리자 페이지 (테스트용) */
  '/admin',
]
