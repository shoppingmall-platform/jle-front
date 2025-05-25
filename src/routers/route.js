import { createBrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ErrorPage from '@/pages/ErrorPage'
import UserLayout from '@/layout/userLayouts/UserLayout'
import AdminLayout from '@/layout/adminLayouts/AdminLayout'
import { userRouter } from './UserRouter'
import { adminRouter } from './AdminRouter'
import { AUTH_EXCLUSIONS_ROUTER_NAME } from '@/apis/auth/authConstants'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const tokenInfo = authStore.getState().tokenInfo
  const isAdmin = authStore.getState()?.isAdmin

  useEffect(() => {
    const isPublicPath = AUTH_EXCLUSIONS_ROUTER_NAME.some((path) => {
      // :id와 같은 동적 파라미터를 처리하기 위한 정규식 변환
      const pathRegex = new RegExp('^' + path.replace(/:[^/]+/g, '[^/]+') + '$')
      return pathRegex.test(location.pathname)
    })

    // 관리자 권한 체크
    if (location.pathname.startsWith('/admin')) {
      if (!tokenInfo) {
        // 인증되지 않은 경우
        navigate('/login', {
          state: { from: location.pathname },
          replace: true,
        })
        return
      }
      if (!isAdmin) {
        // 인증은 되어있지만 admin이 아닌 경우
        alert('접근 권한이 없습니다.')
        return
      }
    }

    // 사용자 권한 체크
    if (!isPublicPath && !tokenInfo) {
      // 현재 시도한 URL을 state로 저장하여 로그인 후 리다이렉트
      navigate('/login', {
        state: { from: location.pathname },
        replace: true,
      })
    }
  }, [location.pathname, tokenInfo, navigate])

  return children
}

export const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [...userRouter, { path: '*', element: <ErrorPage /> }],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [...adminRouter, { path: '*', element: <ErrorPage /> }],
  },
])
