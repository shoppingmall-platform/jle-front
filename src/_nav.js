import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: '여기 이름 뭘로 하지',
  },
  {
    component: CNavGroup,
    name: '상품',
    to: '/products',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: '상품등록',
        to: 'products/add',
      },
      {
        component: CNavItem,
        name: '상품목록',
        to: 'products/list',
      },
      {
        component: CNavItem,
        name: '상품관리',
        to: 'products/manage',
      },
      {
        component: CNavItem,
        name: '카테고리',
        to: 'products/categories',
      },
      {
        component: CNavItem,
        name: '옵션관리',
        to: 'products/option',
      },
    ],
  },
  {
    component: CNavGroup,
    name: '고객',
    to: '/customers',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: '회원조회',
        to: 'customers/list',
      },
      {
        component: CNavItem,
        name: '회원관리',
        to: 'customers/manage',
      },
    ],
  },
  {
    component: CNavGroup,
    name: '주문',
    to: '/orders',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: '주문 목록',
        to: 'orders/list',
      },
      {
        component: CNavItem,
        name: '주문 취소',
        to: 'orders/cancel',
      },
    ],
  },

  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
]

export default _nav
