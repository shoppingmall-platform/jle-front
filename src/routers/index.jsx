// 각 라우터 모듈 import
import Header from "@/components/common/Header";
import { CommonRouter } from "@/routers/common/CommonRouter";
import { ProductRouter } from "@/routers/product/ProductRouter";
import { Navigate } from "react-router-dom";

export const routes = [
  {
    path: "/",
    element: <Header />,
    children: CommonRouter,
  },
  {
    path: "/",
    element: <Header />,
    children: ProductRouter,
  },
  //   {
  //     path: "*",
  //     element: <Navigate to="/404" replace />,
  //   },
];
