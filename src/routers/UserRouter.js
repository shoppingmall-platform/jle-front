import { element } from 'prop-types'
import React from 'react'

const UserMain = React.lazy(() => import('@/pages/userPages/UserMain'))
const Login = React.lazy(() => import('@/pages/userPages/Login'))
const Signup = React.lazy(() => import('@/pages/userPages/Signup'))

export const userRouter = [
  { path: '', element: UserMain },
  { path: '/login', element: Login },
  { path: '/signup', element: Signup },
]
