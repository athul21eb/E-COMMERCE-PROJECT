import { Outlet } from "react-router-dom";

import Footer from '../../layout/user/userFooter/Footer'


import Header from '../../layout/user/userHeader/Header';
import { useEffect } from "react";
function UserHeader() {

 

  return (
    <>
      <Header />
<div className="mt-16 min-h-screen ">
      <Outlet />
      </div>
      <Footer/>
    </>
  );
}

export default UserHeader;
