import { Route, Navigate, Outlet } from "react-router-dom";


import Homepage from "../pages/user/home/HomePage";
import LoginPage from "../pages/user/Login/LoginPage";
import SignUpPage from "../pages/user/signUp/SignUpPage";
import OtpValidationPage from "../pages/user/otp/OtpPage";
import ForgotPasswordPage from "../pages/user/forgotPassword/ForgotPasswordPage";
import ForgotOtpPage from "../pages/user/forgotPassword/ForgotOtp/ForgotOtpPage";
import SetNewPassword from "../pages/user/forgotPassword/passwordReset/PasswordReset.jsx";
import UserHeader from "../components/wrappers/userWrapper/UserHeaderWrapper";
import UserRedirectRoute from "../protectRoutes/user/userRedirectRoute/UserRedirectRoutes.jsx";
import UserProtectedRoutes from "../protectRoutes/user/userProtectedRoute/UserProtectedRoutes.jsx";
import UserProfileWrapper from "../components/wrappers/userProfileWrapper/userProfilieWrapper.jsx";
import Cart from "../pages/user/cart/CartPage.jsx";
import CheckoutPage from "../pages/user/checkOut/CheckOut.jsx";

import Wishlist from "../pages/user/wishlist/Wishlist.jsx";

// User Account Pages
import ProfilePage from "../pages/user/account/overView/ProfilePage.jsx";
import Orders from "../pages/user/account/orders/Orders.jsx";
import Wallet from "../pages/user/account/wallet/Wallet.jsx";
import AccountAddresses from "../pages/user/account/address/AccountAddresses.jsx";
import AccountAddAddress from "../pages/user/account/address/accountAddAddress/AccountAddAddress.jsx";
import AccountEditAddress from "../pages/user/account/address/accountEditAddress/AccountEditAddress.jsx";
import OrderDetails from "../pages/user/account/orders/orderDetails/OrderDetails.jsx";

// Other Pages
import ProductPage from "../pages/user/productDetails/ProductDetailsPage.jsx";
import ShopAll from "../pages/user/shopAll/ShopAll.jsx";
import MenPage from "../pages/user/MenPage/MenPage.jsx";
import WomenPage from "../pages/user/womenPage/WomenPage.jsx";
import KidsPage from "../pages/user/kidPage/KidsPage.jsx";


export const UserRoutes = (
  <>
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
      {/* Public Pages */}
      <Route index element={<Homepage />} />
      <Route path="product-details" element={<ProductPage />} />
      <Route path="shop" element={<ShopAll />} />
      <Route path="men" element={<MenPage />} />
      <Route path="women" element={<WomenPage />} />
      <Route path="kids" element={<KidsPage />} />

      {/* Protected User Routes */}
      <Route element={<UserProtectedRoutes />}>
        <Route path="account" element={<UserProfileWrapper />}>
          <Route index element={<Navigate to="overview" />} />
          <Route path="overview" element={<ProfilePage />} />
          <Route path="orders" element={<Outlet />}>
            <Route index element={<Orders />} />
            <Route path="order-details" element={<OrderDetails />} />
          </Route>
          <Route path="wallet" element={<Wallet />} />
          <Route path="addresses" element={<Outlet />}>
            <Route index element={<AccountAddresses />} />
            <Route path="add-Addresses" element={<AccountAddAddress />} />
            <Route path="edit-Addresses" element={<AccountEditAddress />} />
          </Route>
        </Route>
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        
          <Route path="checkOut" element={<Outlet />}>
            <Route index element={<CheckoutPage />} />
            <Route path="addresses" element={<Outlet />}>
              <Route index element={<ManageAddresses />} />
              <Route path="add" element={<AddAddressPage />} />
              <Route path="edit" element={<EditAddress />} />
            </Route>
          </Route>
       
      </Route>
    </Route>
  </>
);
import { element } from "prop-types";import AddAddressPage from "../pages/user/Address/addAddresses/AddAddresses.jsx";
import EditAddress from "../pages/user/Address/editAddresses/EditAddress.jsx";
import ManageAddresses from "../pages/user/Address/manageAddresses/ManageAddress.jsx";

