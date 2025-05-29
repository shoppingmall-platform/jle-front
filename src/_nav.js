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
  cilTag,
  cilDollar,
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
    name: '관리자 메뉴',
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
      // {
      //   component: CNavItem,
      //   name: '상품관리',
      //   to: 'products/manage',
      // },
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
        name: '주문목록',
        to: 'orders/list',
      },
      {
        component: CNavItem,
        name: '주문취소',
        to: 'orders/cancel',
      },
    ],
  },
  {
    component: CNavGroup,
    name: '프로모션',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    items: [
      {
        component: CNavGroup,
        name: '할인',
        to: '/promotion/discounts',
        icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: '할인등록',
            to: 'promotion/discounts/add',
          },
          {
            component: CNavItem,
            name: '할인조회',
            to: 'promotion/discounts/list',
          },
        ],
      },
      {
        component: CNavGroup,
        name: '쿠폰',
        to: '/promotion/coupons',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: '쿠폰등록',
            to: 'promotion/coupons/add',
          },
          {
            component: CNavItem,
            name: '쿠폰조회',
            to: 'promotion/coupons/list',
          },
        ],
      },
    ],
  },
]

export default _nav
