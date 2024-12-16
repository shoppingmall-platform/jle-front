import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routers/router";

const App = () => {
  return <RouterProvider router={routes} />;
};

export default App;
