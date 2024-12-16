import Dashboard from "../pages/userPages/Dashboard";
import ProductPage from "../pages/userPages/ProductPage";

export const userRouter = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/product/:id",
    element: <ProductPage />,
  },
];
