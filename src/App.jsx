import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0,{behavior: "smooth"} ); // Scrolls to the top of the page
  }, [pathname]);
  return (
    <>
    <ToastContainer theme="dark"/>
    <Outlet />

</>
    
  );
}

export default App;
