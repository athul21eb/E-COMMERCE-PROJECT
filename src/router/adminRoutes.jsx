import { Route, Navigate, Outlet } from "react-router-dom";
import AdminLoginPage from "../pages/admin/adminLogin/AdminLoginPage.jsx";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard.jsx";
import AdminProducts from "../pages/admin/product/AdminProducts.jsx";
import AdminBrands from "../pages/admin/brands/AdminBrands.jsx";
import AdminOrders from "../pages/admin/order/AdminOrders.jsx";
import AdminSalesReport from "../pages/admin/salesReport/AdminSalesReport.jsx";
import AdminCoupons from "../pages/admin/coupons/AdminCoupons.jsx";
import AdminBanners from "../pages/admin/banners/AdminBanners.jsx";
import AdminUserManagement from "../pages/admin/customers/AdminUserManagement.jsx";
import AdminCategory from "../pages/admin/category/AdminCategory.jsx";
import AddProduct from "../pages/admin/product/productCreatePage/productAddPage.jsx";
import EditProductForm from "../pages/admin/product/productEditpage/ProductEditPage.jsx";
import AdminOrderDetails from "../pages/admin/order/orderDetails/AdminOrderDetails.jsx";

// Admin Wrappers and Protected Routes
import AdminHeader from "../components/wrappers/adminWrapper/AdminHeaderWrapper.jsx";
import AdminProtectedRoutes from "../protectRoutes/admin/adminProtectedRoute/AdminProtectedRoutes.jsx";
import AdminRedirectRoute from "../protectRoutes/admin/adminRedirectRoutes/AdminRedirectRoute.jsx";
import AdminOffers from '../pages/admin/offers/AdminOffers.jsx'

export const AdminRoutes = (
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
        <Route path="offers" element={<AdminOffers />} />
      </Route>
    </Route>
  </Route>
);

