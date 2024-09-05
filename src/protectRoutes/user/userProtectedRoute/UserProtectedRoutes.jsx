import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";


const UserProtectedRoutes = () => {

  const { user } = useSelector((state) => state.auth.authInfo);

 

  return user?.isVerified ? (<Outlet />) :( <Navigate to="/login" replace />);
};

export default UserProtectedRoutes;
