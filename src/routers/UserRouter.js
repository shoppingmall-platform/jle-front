import { element } from 'prop-types'
import React from 'react'

const Home = React.lazy(() => import('@/pages/userPages/Home'))
const Category = React.lazy(() => import('@/pages/userPages/Category'))
const Tag = React.lazy(() => import('@/pages/userPages/Tag'))
const ProductDetail = React.lazy(() => import('@/pages/userPages/ProductDetail'))
const Login = React.lazy(() => import('@/pages/userPages/Login'))
const Signup = React.lazy(() => import('@/pages/userPages/Signup'))
const Cart = React.lazy(() => import('@/pages/userPages/Cart'))
const Mypage = React.lazy(() => import('@/pages/userPages/mypage/Mypage'))
const Profile = React.lazy(() => import('@/pages/userPages/mypage/Profile'))
const AddressList = React.lazy(() => import('@/pages/userPages/mypage/address/AddressList'))
const AddressAdd = React.lazy(() => import('@/pages/userPages/mypage/address/AddressAdd'))

export const userRouter = [
  { path: '/', element: Home },
  { path: '/category/:categoryId', element: Category },
  { path: '/tag/:tagId', element: Tag },
  { path: '/product/:productId', element: ProductDetail },
  { path: '/login', element: Login },
  { path: '/signup', element: Signup },
  { path: '/cart', element: Cart },
  { path: '/mypage', element: Mypage },
  { path: '/mypage/profile', element: Profile },
  { path: '/mypage/address', element: AddressList },
  { path: '/mypage/address/add', element: AddressAdd },
]
