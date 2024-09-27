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
import AdminBanners from "../pages/admin/banners/AdminBanners.jsx";
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
import AccountAddAddress from "../pages/user/account/address/accountAddAddress/AccountAddAddress.jsx";
import AccountEditAddress from "../pages/user/account/address/accountEditAddress/AccountEditAddress.jsx";
import OrderDetails from "../pages/user/account/orders/orderDetails/OrderDetails.jsx";
import AdminOrderDetails from "../pages/admin/order/orderDetails/AdminOrderDetails.jsx";
import ShopAll from "../pages/user/shopAll/ShopAll.jsx";
import MenPage from "../pages/user/MenPage/MenPage.jsx";

import WomenPage from "../pages/user/womenPage/WomenPage.jsx";
import KidsPage from "../pages/user/kidPage/KidsPage.jsx";
import NotFound from "../components/common/notFound/NotFoundPage.jsx";
import Wishlist from "../pages/user/wishlist/Wishlist.jsx";





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
        <Route path="shop" element={<ShopAll />} />
        <Route path="men" element={<MenPage />} />
        <Route path="women" element={<WomenPage />} />
        <Route path="kids" element={<KidsPage />} />

        <Route element={<UserProtectedRoutes />}>
          <Route path="account" element={<UserProfileWrapper />}>
            <Route index element={<Navigate to="overview" />} />
            <Route index path="overview" element={<ProfilePage />} />
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
          <Route path='wishlist' element={<Wishlist/>}/>
          <Route path="addresses" element={<ManageAddresses />} />

          <Route path="checkOut" element={<Outlet />}>
            <Route index element={<CheckoutPage />} />
            <Route path="addresses" element={<Outlet />}>
              <Route index element={<ManageAddresses />} />
              <Route path="add" element={<AddAddressPage />} />
              <Route path="edit" element={<EditAddress />} />
            </Route>
          </Route>
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
            <Route path="orders" element={<Outlet />}>
              <Route index element={<AdminOrders />} />
              <Route path="order-details" element={<AdminOrderDetails />} />
            </Route>
            <Route path="sales-report" element={<AdminSalesReport />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="banners" element={<AdminBanners />} />
          </Route>
        </Route>
      </Route>
      <Route path='*' element={<NotFound/>}/>
      
    </Route>
  )
);

export default router;
