import React from "react";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./DashboardHome";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <DashboardHome />
      </div>
    </div>
  );
};

export default DashboardLayout;