import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const AdminLayout = () => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh", padding: "0" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
