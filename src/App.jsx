import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "@/App.css";

import { CommonRouter } from "@/routers/common/CommonRouter";
import { ProductRouter } from "@/routers/product/ProductRouter";
import { ThemeProvider } from "@mui/material";
import { userTheme } from "@/layouts/UserTheme";
import { adminTheme } from "@/layouts/AdminTheme";

import Header from "@/components/common/Header";

import { routes } from "@/routers";
import ErrorPage from "@/pages/common/ErrorPage";
// import Dashboard from "@/pages/common/Dashboard";
// import ProductPage from "@/pages/product/ProductPage";

function App() {
  const [count, setCount] = useState(0);
  const router = createBrowserRouter(routes);

  return (
    <>
      {/* <Header /> */}
      <RouterProvider router={router} />
      {/* <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <ThemeProvider theme={userTheme}>
                <CommonRouter />
              </ThemeProvider>
            }
          />
          <Route
            path="/product/*"
            element={
              <ThemeProvider theme={adminTheme}>
                <ProductRouter />
              </ThemeProvider>
            }
          />
          <Route path="/404" element={<ErrorPage />} />
          <Route path="/:pathMatch(.*)*" redirect="/404" />
        </Routes>
      </Router> */}
    </>
  );
}

export default App;
