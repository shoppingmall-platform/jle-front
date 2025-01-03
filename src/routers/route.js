import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '@/pages/ErrorPage'
import UserLayout from '@/layout/userLayouts/UserLayout'
import AdminLayout from '@/layout/adminLayouts/AdminLayout'
import { userRouter } from './UserRouter'
import { adminRouter } from './AdminRouter'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [...userRouter, { path: '*', element: <ErrorPage /> }],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [...adminRouter, { path: '*', element: <ErrorPage /> }],
  },
])
