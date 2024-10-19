import { createBrowserRouter, createRoutesFromElements, Navigate, Route, Outlet } from "react-router-dom";
import App from "../App";
import NotFound from "../components/common/notFound/NotFoundPage.jsx";

// Import User and Admin Routes
import { UserRoutes } from "./userRoutes";
import { AdminRoutes } from "./adminRoutes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* User Routes */}
      {UserRoutes}

      {/* Admin Routes */}
      {AdminRoutes}

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
