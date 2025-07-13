import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // 1. Jika context masih loading, tampilkan pesan...
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h3>Memeriksa otorisasi...</h3>
      </div>
    );
  }

  // 2. Jika sudah tidak loading, dan ternyata user adalah admin yang terotentikasi...
  if (isAuthenticated && user?.role.toLowerCase() === "admin") {
    // ...maka izinkan akses ke halaman yang dituju (direpresentasikan oleh <Outlet />)
    return <Outlet />;
  }

  // 3. Jika tidak memenuhi syarat di atas, "usir" kembali ke halaman login
  return <Navigate to="/simpadu/login" replace />;
};

export default AdminLayout;
