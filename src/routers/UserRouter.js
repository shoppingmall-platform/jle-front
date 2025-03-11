import { element } from 'prop-types'
import React from 'react'

const Home = React.lazy(() => import('@/pages/userPages/Home'))
const Login = React.lazy(() => import('@/pages/userPages/Login'))
const Signup = React.lazy(() => import('@/pages/userPages/Signup'))

export const userRouter = [
  { path: '/', element: Home },
  { path: '/login', element: Login },
  { path: '/signup', element: Signup },
]
