import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import AppLayout from "./components/layouts/AppLayout";

// Auth Pages
import Login from "./pages/Login";
import Index from "./pages/Index";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import MataKuliah from "./pages/student/MataKuliah";
import StudentPresensi from "./pages/student/Presensi";
import KHS from "./pages/student/KHS";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/students";

// Error Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// =====================================================================
// PERBAIKAN UTAMA ADA DI DUA KOMPONEN DI BAWAH INI
// =====================================================================

// Route guard untuk semua pengguna yang sudah login (Mahasiswa & Admin)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Ambil juga 'loading' dari context
  const { isAuthenticated, loading } = useAuth();

  // 1. Jika context masih loading, tampilkan pesan loading...
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h3>Memuat sesi...</h3>
      </div>
    );
  }

  // 2. Jika sudah tidak loading dan ternyata belum login, lempar ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Jika lolos, tampilkan halaman yang dituju
  return <>{children}</>;
};

// Route guard KHUSUS untuk admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // Ambil semua state yang relevan
  const { user, isAuthenticated, loading } = useAuth();

  // 1. Sama seperti ProtectedRoute, tunggu loading selesai
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h3>Memeriksa otorisasi admin...</h3>
      </div>
    );
  }

  // 2. Setelah loading selesai, cek apakah user adalah admin
  if (isAuthenticated && user?.role.toLowerCase() === "admin") {
    return <>{children}</>; // Jika ya, tampilkan halaman admin
  }

  // 3. Jika tidak, lempar ke halaman login
  return <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/simpadu">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Student routes sekarang menggunakan ProtectedRoute yang sudah diperbaiki */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <StudentDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <StudentProfile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matakuliah"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MataKuliah />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/presensi"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <StudentPresensi />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/khs"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <KHS />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin routes sekarang menggunakan AdminRoute yang sudah diperbaiki */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <AdminRoute>
                    <AdminStudents />
                  </AdminRoute>
                }
              />

              {/* Error routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
