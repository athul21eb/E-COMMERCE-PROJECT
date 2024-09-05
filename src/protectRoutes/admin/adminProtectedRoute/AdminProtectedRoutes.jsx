import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";


const AdminProtectedRoutes = () => {

  const { admin } = useSelector((state) => state.auth.authInfo);

 

  return admin?.role==="admin" ? (<Outlet />) :( <Navigate to="/admin/login" replace />);
};

export default AdminProtectedRoutes;
