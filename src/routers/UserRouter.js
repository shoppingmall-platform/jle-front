import { element } from 'prop-types'
import React from 'react'

const Home = React.lazy(() => import('@/pages/userPages/Home'))
const Category = React.lazy(() => import('@/pages/userPages/Category'))
const ProductDetail = React.lazy(() => import('@/pages/userPages/ProductDetail'))
const Login = React.lazy(() => import('@/pages/userPages/Login'))
const Signup = React.lazy(() => import('@/pages/userPages/Signup'))
const Mypage = React.lazy(() => import('@/pages/userPages/Mypage'))
const Profile = React.lazy(() => import('@/pages/userPages/Profile'))
export const userRouter = [
  { path: '/', element: Home },
  { path: '/category/:categoryId', element: Category },
  { path: '/product/:productId', element: ProductDetail },
  { path: '/login', element: Login },
  { path: '/signup', element: Signup },
  { path: '/mypage', element: Mypage },
  { path: '/profile', element: Profile },
]
