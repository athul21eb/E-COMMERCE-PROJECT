import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRedirectRoute = () => {
  const {admin} = useSelector((state) => state.auth.authInfo);


  return !admin ?  <Outlet/>:(<Navigate to="dashboard" replace/> );
};

export default AdminRedirectRoute;
