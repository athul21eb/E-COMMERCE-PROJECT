import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const UserRedirectRoute = () => {
  const {user} = useSelector((state) => state.auth.authInfo);


  return user?.isVerified ?  (<Navigate to="/" replace/> ):<Outlet/> ;
};

export default UserRedirectRoute;
