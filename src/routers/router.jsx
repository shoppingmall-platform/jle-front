import { createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { userTheme } from "@/themes/UserTheme";
import { adminTheme } from "@/themes/AdminTheme";
import ErrorPage from "../pages/ErrorPage";
import UserLayout from "../layouts/userLayouts/UserLayout";
import AdminLayout from "../layouts/adminLayouts/AdminLayout";
import { userRouter } from "./userRouter";
import { adminRouter } from "./adminRouter";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider theme={userTheme}>
        <UserLayout />
      </ThemeProvider>
    ),
    children: [...userRouter, { path: "*", element: <ErrorPage /> }],
  },
  {
    path: "/admin",
    element: (
      <ThemeProvider theme={adminTheme}>
        <AdminLayout />
      </ThemeProvider>
    ),
    children: [...adminRouter, { path: "*", element: <ErrorPage /> }],
  },
]);
