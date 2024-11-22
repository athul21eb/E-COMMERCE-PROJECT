import { Outlet } from "react-router-dom";

import Footer from "../../layout/user/userFooter/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "../../layout/user/userHeader/Header";




const queryClient = new QueryClient();


function UserHeader() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="mt-16 min-h-screen ">
          <Outlet />
        </div>
        <Footer />
      </QueryClientProvider>
    </>
  );
}

export default UserHeader;
