import React from "react";
import LoginPage from "../../user/Login/LoginPage";
import { useAdminLoginMutation } from "../../../slices/auth/authApiSlice";

const AdminLoginPage = () => {
  return (
    
     
      <LoginPage
        header="Admin Login"
        user={false}
        mutation={useAdminLoginMutation}
      />
    
  );
};

export default AdminLoginPage;
