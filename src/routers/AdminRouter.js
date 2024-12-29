import React from 'react'

const Dashboard = React.lazy(() => import('@/pages/adminPages/dashboard/Dashboard'))
const ProductMain = React.lazy(() => import('@/pages/adminPages/product/ProductMain'))
const ProductAdd = React.lazy(() => import('@/pages/adminPages/product/ProductAdd'))
const ProductList = React.lazy(() => import('@/pages/adminPages/product/ProductList'))
const ProductManage = React.lazy(() => import('@/pages/adminPages/product/ProductManage'))
const ProductCategories = React.lazy(() => import('@/pages/adminPages/product/ProductCategories'))
const CustomerMain = React.lazy(() => import('@/pages/adminPages/customer/CustomerMain'))
const CustomerList = React.lazy(() => import('@/pages/adminPages/customer/CustomerList'))
const OrderMain = React.lazy(() => import('@/pages/adminPages/order/OrderMain'))
const OrderList = React.lazy(() => import('@/pages/adminPages/order/OrderList'))

export const adminRouter = [
  { path: '', element: Dashboard },
  { path: 'products', element: ProductMain },
  { path: 'products/add', element: ProductAdd },
  { path: 'products/list', element: ProductList },
  { path: 'products/manage', element: ProductManage },
  { path: 'products/categories', element: ProductCategories },
  { path: 'customers', element: CustomerMain },
  { path: 'customers/list', element: CustomerList },
  { path: 'orders', element: OrderMain },
  { path: 'orders/list', element: OrderList },
]
