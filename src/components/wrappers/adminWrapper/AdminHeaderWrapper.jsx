import React from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "../../layout/admin/SideBarHeader/AdminLayout";
const AdminHeader = () => {
  console.log("header rended");
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminHeader;
