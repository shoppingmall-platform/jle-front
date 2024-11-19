import React from "react";
import { Route, Routes } from "react-router-dom";

import ProductPage from "@/pages/product/ProductPage";

export const ProductRouter = [
  {
    path: "/product",
    element: <ProductPage />,
  },
];

// const ProductRouter = () => {
//   return (
//     <Routes>
//       <Route path="product" element={<ProductPage />} />
//     </Routes>
//   );
// };

// export default ProductRouter;
