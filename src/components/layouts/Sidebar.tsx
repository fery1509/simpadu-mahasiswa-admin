import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHoverSound } from "@/hooks/useHoverSound";

import polibanLogo from "@/assets/images/Poliban_logo1.png";

import {
  Home,
  Book,
  Calendar,
  FileText,
  User,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  BookOpen,
  GraduationCap,
} from "lucide-react";

interface SidebarProps {
  mobile?: boolean; // Dibuat optional untuk konsistensi
  onCloseSidebar?: () => void;
}

// PERUBAHAN 1: Buat interface baru sesuai data API
interface Mahasiswa {
  nim: string;
  nama: string;
  email: string;
  no_hp: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  image: string | null; // Image bisa jadi null
}

const Sidebar = ({ mobile, onCloseSidebar }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // PERUBAHAN 2: State untuk data mahasiswa dari API
  const [studentData, setStudentData] = useState<Mahasiswa | null>(null);

  // PERUBAHAN 3: Logika fetch data diubah menjadi dinamis
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;

      const nim = user.email.split("@")[0];
      if (!nim) return;

      try {
        const response = await fetch(`/api/mahasiswa/${nim}`);
        if (response.ok) {
          const apiResponse = await response.json();
          setStudentData(apiResponse.data);
        } else {
          console.error("Gagal mengambil data mahasiswa untuk sidebar");
        }
      } catch (error) {
        console.error("Error fetching student data for sidebar:", error);
      }
    };

    // Hanya panggil jika user adalah mahasiswa
    if (user && user.role.toLowerCase() === "user") {
      fetchStudentData();
    }
  }, [user]);

  const { playSound } = useHoverSound("/sounds/hover-sound.mp3");

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Profil", icon: User, path: "/profile" },
    { name: "Mata Kuliah", icon: BookOpen, path: "/MataKuliah" },
    { name: "Presensi", icon: Calendar, path: "/Presensi" },
    { name: "KHS", icon: GraduationCap, path: "/KHS" },
  ];

  const handleMouseEnter = () => {
    playSound();
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  return (
    <div className="h-full flex flex-col bg-kampus-primary text-white">
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-kampus-secondary">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={polibanLogo}
            alt="Poliban Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold">SIMPADU</span>
        </Link>
        {mobile && (
          <button
            type="button"
            className="text-white hover:text-gray-200 focus:outline-none"
            onClick={onCloseSidebar}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-kampus-secondary">
        <div className="flex items-center space-x-3">
          {/* PERUBAHAN 4: Logika penampilan foto profil dan nama disesuaikan */}
          <img
            src={`https://ui-avatars.com/api/?name=${
              studentData?.nama || user?.name || "User"
            }&background=4F46E5&color=fff&length=2`}
            alt={`Inisial ${studentData?.nama || user?.name}`}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{studentData?.nama || user?.name}</p>
            <p className="text-sm text-kampus-light">Mahasiswa</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onMouseEnter={handleMouseEnter}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors
              ${
                isActivePath(item.path)
                  ? "bg-kampus-dark text-white"
                  : "text-kampus-light hover:bg-kampus-secondary hover:text-white"
              }
            `}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-kampus-secondary">
        <button
          onClick={handleLogout}
          onMouseEnter={handleMouseEnter}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-kampus-light rounded-md hover:bg-kampus-secondary hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
