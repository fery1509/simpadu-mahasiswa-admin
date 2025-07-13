import { useState } from "react";
import { Link } from "react-router-dom";
import { User, GraduationCap, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarAdmin from "./SidebarAdmin";
import HeaderAdmin from "./HeaderAdmin";
import EnrollmentTrendsChart from "@/components/charts/EnrollmentTrendsChart";

// Komponen ini sekarang hanya fokus untuk menampilkan UI
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data statistik untuk ditampilkan
  const stats = [
    {
      label: "Total Mahasiswa",
      value: 1240,
      icon: User,
      change: "+12%",
      changeType: "increase",
      description: "Dari bulan lalu",
    },
    {
      label: "Total Program Studi",
      value: 19,
      icon: GraduationCap,
      change: "+2",
      changeType: "increase",
      description: "Program studi aktif",
    },
    {
      label: "Mahasiswa Baru",
      value: 156,
      icon: Users,
      change: "+8%",
      changeType: "increase",
      description: "Tahun ajaran ini",
    },
    {
      label: "Pertumbuhan",
      value: "12.5%",
      icon: TrendingUp,
      change: "+2.3%",
      changeType: "increase",
      description: "Dari tahun lalu",
    },
  ];

  return (
    // Mengubah warna background utama agar lebih cocok
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarAdmin />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-kampus-primary text-white transform transition duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarAdmin onCloseSidebar={() => setSidebarOpen(false)} mobile />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <HeaderAdmin onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="pb-5 border-b border-gray-200 max-w-7xl">
              <h3 className="text-2xl font-bold leading-tight text-gray-800">
                Welcome to SIMPADU Admin
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Selamat datang di sistem administrasi akademik.
              </p>
            </div>

            {/* Banner disesuaikan */}
            <div className="mt-6 bg-[#000e7c] rounded-xl shadow-lg p-6 text-white flex flex-col md:flex-row items-center justify-between">
              <div className="space-y-2">
                <h4 className="text-xl font-bold">Ringkasan Tugas Admin</h4>
                <p className="text-indigo-100 text-sm">
                  Berikut adalah beberapa tugas utama yang dapat Anda lakukan di
                  sini:
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3 justify-center">
                <Link
                  to="/admin/students"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-[#000e7c] bg-white hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000e7c] transition-colors"
                >
                  Kelola Data Mahasiswa
                </Link>
              </div>
            </div>

            {/* Statistik disesuaikan */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className={`
                    hover:shadow-lg transition-all duration-200 hover:scale-[1.02] p-6 rounded-xl border-b-4
                    bg-white border-[#000e7c] shadow-sm
                  `}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-sm font-medium text-[#000e7c]">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-5 w-5 text-[#000e7c]" />
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <div className="text-2xl font-bold text-[#000e7c]">
                      {stat.value}
                    </div>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "increase"
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-[#000e7c]/70 ml-2">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enrollment Trends Chart */}
            <div className="mt-6 max-w-7xl">
              <EnrollmentTrendsChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
