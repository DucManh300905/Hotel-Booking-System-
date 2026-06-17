import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout  from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedRoute, AdminRoute } from "../components/common/ProtectedRoute";

import Home           from "../pages/Home";
import Login          from "../pages/Login";
import Register       from "../pages/Register";
import Rooms          from "../pages/Rooms";
import RoomDetailPage from "../pages/RoomDetailPage";
import MyBookings     from "../pages/MyBookings";
import GuestLookup    from "../pages/GuestLookup";
import PointsPage     from "../pages/PointsPage";
import Admin          from "../pages/Admin";
import AdminRooms     from "../components/admin/AdminRooms";
import VerifyEmail    from "../pages/VerifyEmail";
import ResetPassword  from "../pages/ResetPassword";
import NotFound       from "../pages/NotFound";

export default function AppRoutes({ showToast }) {
  return (
    <Routes>
      {/* Main layout */}
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/rooms" replace />} />
        <Route path="/home"          element={<Home />} />
        <Route path="/rooms"         element={<Rooms showToast={showToast} />} />
        <Route path="/rooms/:id"     element={<RoomDetailPage showToast={showToast} />} />

        <Route path="/login"          element={<Login    showToast={showToast} />} />
        <Route path="/register"       element={<Register showToast={showToast} />} />
        <Route path="/verify-email"   element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword showToast={showToast} />} />

        {/* Không cần đăng nhập */}
        <Route path="/guest-lookup" element={<GuestLookup />} />

        {/* Cần đăng nhập */}
        <Route path="/my-bookings" element={
          <ProtectedRoute><MyBookings /></ProtectedRoute>
        } />
        <Route path="/points" element={
          <ProtectedRoute><PointsPage /></ProtectedRoute>
        } />
      </Route>

      {/* Admin layout */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin/dashboard" element={<Admin showToast={showToast} />} />
        <Route path="/admin/rooms"     element={<AdminRooms showToast={showToast} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
