import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Toaster } from 'react-hot-toast';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/themeContext";
import ErrorBoundary from "./components/common/errorBoundary/ErrorBoundary";


function App() {
  const { pathname,search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0,{behavior: "smooth"} ); // Scrolls to the top of the page
  }, [pathname,search]);
  return (
    <>
      {/* React Hot Toast */}
<Toaster
  position="top-center"
  reverseOrder={false}
  toastOptions={{
    // Define default options for all toasts
    style: {
      background: '#fff',  // Light background for the toast
      color: '#333',       // Dark text color
      border: '1px solid #e0e0e0', // Light border for better contrast
    },
    // Define specific options for success toasts
    success: {
      duration: 3000,
      style: {
        background: '#eaffea',  // Light green background for success toasts
        color: '#2e7d32',       // Dark green text for success toasts
        border: '1px solid #a5d6a7', // Green border for success toasts
      },
    },
    // Define specific options for error toasts
    error: {
      duration: 3000,
      style: {
        background: '#ffebee',  // Light red background for error toasts
        color: '#c62828',       // Dark red text for error toasts
        border: '1px solid #ef9a9a', // Red border for error toasts
      },
    },
  }}
/>

<ErrorBoundary>
    <ToastContainer theme="dark"/>
    <ThemeProvider>
    <Outlet />
    </ThemeProvider>
    </ErrorBoundary>

</>
    
  );
}

export default App;
