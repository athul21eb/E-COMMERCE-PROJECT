import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
} from "react-router-dom";
import App from "../App";

import Homepage from "../pages/user/home/HomePage";

import LoginPage from "../pages/user/Login/LoginPage";
import SignUpPage from "../pages/user/signUp/SignUpPage";
import OtpValidationPage from "../pages/user/otp/OtpPage";
import ProfilePage from "../pages/user/account/overView/ProfilePage.jsx";
import AdminLoginPage from "../pages/admin/adminLogin/AdminLoginPage.jsx";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AdminProducts from "../pages/admin/product/AdminProducts";

import AdminBrands from "../pages/admin/brands/AdminBrands";
import AdminOrders from "../pages/admin/order/AdminOrders";
import AdminSalesReport from "../pages/admin/salesReport/AdminSalesReport";
import AdminCoupons from "../pages/admin/coupons/AdminCoupons";
import AdminSettings from "../pages/admin/settings/AdminSettings";
import AdminUserManagement from "../pages/admin/customers/AdminUserManagement";
import AdminHeader from "../components/wrappers/adminWrapper/AdminHeaderWrapper";
import UserHeader from "../components/wrappers/userWrapper/UserHeaderWrapper";
import AdminProtectedRoutes from "../protectRoutes/admin/adminProtectedRoute/AdminProtectedRoutes";
import AdminRedirectRoute from "../protectRoutes/admin/adminRedirectRoutes/AdminRedirectRoute";
import AddProduct from "../pages/admin/product/productCreatePage/productAddPage";
import ProductPage from "../pages/user/productDetails/ProductDetailsPage.jsx";
import AdminCategory from "../pages/admin/category/AdminCategory.jsx";
import EditProductForm from "../pages/admin/product/productEditpage/ProductEditPage.jsx";
import ForgotPasswordPage from "../pages/user/forgotPassword/ForgotPasswordPage.jsx";
import ForgotOtpPage from "../pages/user/forgotPassword/ForgotOtp/ForgotOtpPage.jsx";
import SetNewPassword from "../pages/user/forgotPassword/passwordReset/PasswordReset.jsx";
import UserRedirectRoute from "../protectRoutes/user/userRedirectRoute/UserRedirectRoutes.jsx";
import UserProtectedRoutes from "../protectRoutes/user/userProtectedRoute/UserProtectedRoutes.jsx";
import Cart from "../pages/user/cart/CartPage.jsx";
import ManageAddresses from "../pages/user/Address/manageAddresses/ManageAddress.jsx";
import AddAddressPage from "../pages/user/Address/addAddresses/AddAddresses.jsx";
import EditAddress from "../pages/user/Address/editAddresses/EditAddress.jsx";
import CheckoutPage from "../pages/user/checkOut/CheckOut.jsx";
import OrderCompletion from "../pages/user/orderSuccesfull/OrderCompletion.jsx";
import UserProfileWrapper from "../components/wrappers/userProfileWrapper/userProfilieWrapper.jsx";
import Orders from "../pages/user/account/orders/Orders.jsx";
import Wallet from "../pages/user/account/wallet/Wallet.jsx";
import AccountAddresses from "../pages/user/account/address/AccountAddresses.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<UserRedirectRoute />}>
        {/* Public User Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="otp" element={<OtpValidationPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="forgot-password-otp" element={<ForgotOtpPage />} />
        <Route path="password-reset" element={<SetNewPassword />} />
      </Route>

      <Route element={<UserHeader />}>
        <Route index element={<Homepage />} />
        <Route path="product-details" element={<ProductPage />} />
        <Route element={<UserProtectedRoutes />}>
        <Route path="account" element={<UserProfileWrapper/>} >
        <Route index element={<Navigate to="overview" replace />}/>
          <Route index path='overview'element={<ProfilePage />} />
          <Route path='orders' element={<Orders/>} />
          <Route path='wallet' element={<Wallet/>} />
          <Route path='addresses' element={<AccountAddresses/>} />
          </Route>
          <Route path="cart" element={<Cart />} />
          <Route path="addresses" element={<ManageAddresses />}/>
            <Route path="add-Addresses" element={<AddAddressPage />} />
            <Route path="edit-Addresses" element={<EditAddress />} />
            <Route path="checkOut" element={<CheckoutPage />} />
            <Route path="order-placed" element={<OrderCompletion />} />
        </Route>
      </Route>
     

      {/* Admin Routes */}
      <Route path="admin" element={<Outlet />}>
        <Route element={<AdminRedirectRoute />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<AdminLoginPage />} />
        </Route>
        <Route element={<AdminProtectedRoutes />}>
          <Route element={<AdminHeader />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<Outlet />}>
              <Route index element={<AdminProducts />} />

              <Route path="create-product" element={<AddProduct />} />
              <Route path="edit-product" element={<EditProductForm />} />
            </Route>
            <Route path="category" element={<AdminCategory />} />
            <Route path="customers" element={<AdminUserManagement />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="sales-report" element={<AdminSalesReport />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

export default router;
