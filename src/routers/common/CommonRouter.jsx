import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from "@/pages/common/Dashboard";
import ErrorPage from "@/pages/common/ErrorPage";

export const CommonRouter = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/404",
    element: <ErrorPage />,
  },
];

// const CommonRouter = () => {
//   return (
//     <Routes>
//       <Route path="dashboard" element={<Dashboard />} />
//       <Route path="404" element={<ErrorPage />} />
//     </Routes>
//   );
// };

// export default CommonRouter;
