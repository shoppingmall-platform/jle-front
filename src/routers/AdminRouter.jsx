import MainDashboard from "../pages/adminPages/MainDashboard";
import OrderMain from "@/pages/adminPages/order/OrderMain";
import CustomerMain from "@/pages/adminPages/customers/CustomerMain";
import ProductAdd from "@/pages/adminPages/product/ProductAdd";
import ProductMain from "@/pages/adminPages/product/ProductMain";
import OrderList from "@/pages/adminPages/order/OrderList";
import CustomerList from "@/pages/adminPages/customers/CustomerList";

export const adminRouter = [
  {
    path: "",
    element: <MainDashboard />,
  },
  {
    path: "products",
    element: <ProductMain />,
  },

  { path: "products/add", element: <ProductAdd /> },
  // { path: "products/list", element: <ProductList /> },
  // { path: "products/manage", element: <ProductManage /> },
  // { path: "products/categories", element: <ProductCategories /> },

  {
    path: "customers",
    element: <CustomerMain />,
  },

  // { path: "customers/manage", element: <CustomerManage /> },
  { path: "customers/list", element: <CustomerList /> },
  {
    path: "orders",
    element: <OrderMain />,
  },

  // { path: "orders/delivery", element: <OrderDelivery /> },
  { path: "orders/list", element: <OrderList /> },
  // { path: "orders/cancel", element: <OrderCancel /> },
];
