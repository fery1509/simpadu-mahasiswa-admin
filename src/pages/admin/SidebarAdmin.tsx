import { Link, useLocation } from "react-router-dom";
// PERUBAHAN 1: Import useAuth
import { useAuth } from "@/context/AuthContext";
import { Home, Users, LogOut, X } from "lucide-react";
import polibanLogo from "@/assets/images/Poliban_logo1.png";

interface SidebarAdminProps {
  mobile?: boolean;
  onCloseSidebar?: () => void;
}

const navItems = [
  { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { name: "Data Mahasiswa", icon: Users, path: "/admin/students" },
];

const SidebarAdmin = ({ mobile, onCloseSidebar }: SidebarAdminProps) => {
  // PERUBAHAN 2: Ambil data user dan fungsi logout dari context
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActivePath = (path: string) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout(); // Gunakan fungsi logout dari context
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  return (
    <div className="flex flex-col w-64 h-full bg-[#000e7c] text-white border-r border-white/20">
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <img
            src={polibanLogo}
            alt="Poliban Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold text-white">SIMPADU Admin</span>
        </Link>
        {mobile && (
          <button onClick={onCloseSidebar} className="text-white">
            <X size={24} />
          </button>
        )}
      </div>

      {/* PERUBAHAN 3: Tampilkan nama dan avatar admin secara dinamis */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.name || "A"
              }&background=1e3269&color=fff`}
              alt="Profile"
              className="h-10 w-10 rounded-full ring-2 ring-white/50"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-[#000e7c]"></div>
          </div>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-sm text-blue-200">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={onCloseSidebar}
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActivePath(item.path)
                ? "bg-blue-800 text-white shadow-lg"
                : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 ${
                isActivePath(item.path) ? "text-white" : "text-blue-200"
              }`}
            />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* PERUBAHAN 4: Gunakan fungsi handleLogout yang baru */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-blue-100 rounded-lg hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;
