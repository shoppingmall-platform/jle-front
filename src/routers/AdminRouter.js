import { PrimeReactContext } from 'primereact/api'
import React from 'react'

const Dashboard = React.lazy(() => import('@/pages/adminPages/dashboard/Dashboard'))
const ProductMain = React.lazy(() => import('@/pages/adminPages/product/ProductMain'))
const ProductAdd = React.lazy(() => import('@/pages/adminPages/product/ProductAdd'))
const ProductList = React.lazy(() => import('@/pages/adminPages/product/ProductList'))
const ProductManage = React.lazy(() => import('@/pages/adminPages/product/ProductManage'))
const ProductCategories = React.lazy(() => import('@/pages/adminPages/product/ProductCategories'))
const ProductOption = React.lazy(() => import('@/pages/adminPages/product/ProductOption'))
const CustomerMain = React.lazy(() => import('@/pages/adminPages/customer/CustomerMain'))
const CustomerList = React.lazy(() => import('@/pages/adminPages/customer/CustomerList'))
const OrderMain = React.lazy(() => import('@/pages/adminPages/order/OrderMain'))
const OrderList = React.lazy(() => import('@/pages/adminPages/order/OrderList'))
const DiscountAdd = React.lazy(() => import('@/pages/adminPages/promotion/DiscountAdd'))
const DiscountList = React.lazy(() => import('@/pages/adminPages/promotion/DiscountList'))
const CouponAdd = React.lazy(() => import('@/pages/adminPages/promotion/CouponAdd'))
const CouponList = React.lazy(() => import('@/pages/adminPages/promotion/CouponList'))

export const adminRouter = [
  { path: '', element: Dashboard },
  { path: 'products', element: ProductMain },
  { path: 'products/add', element: ProductAdd },
  { path: 'products/list', element: ProductList },
  { path: 'products/manage', element: ProductManage },
  { path: 'products/categories', element: ProductCategories },
  { path: 'products/option', element: ProductOption },
  { path: 'customers', element: CustomerMain },
  { path: 'customers/list', element: CustomerList },
  { path: 'orders', element: OrderMain },
  { path: 'orders/list', element: OrderList },
  { path: 'promotion/discounts/add', element: DiscountAdd },
  { path: 'promotion/discounts/list', element: DiscountList },
  { path: 'promotion/coupons/add', element: CouponAdd },
  { path: 'promotion/coupons/list', element: CouponList },
]
