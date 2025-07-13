import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bell, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onOpenSidebar: () => void;
}

// PERUBAHAN 1: Buat interface baru untuk data mahasiswa dari API
interface Mahasiswa {
  nama: string;
  image: string | null;
}

const Header = ({ onOpenSidebar }: HeaderProps) => {
  const { user } = useAuth();

  // PERUBAHAN 2: Ganti state untuk menampung data dari API
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);

  // PERUBAHAN 3: Logika fetch data mahasiswa
  useEffect(() => {
    const fetchStudentData = async () => {
      // Jangan lakukan apa-apa jika user tidak ada atau bukan mahasiswa
      if (!user || user.role.toLowerCase() !== "user") {
        setMahasiswa(null); // Kosongkan data jika bukan mahasiswa
        return;
      }

      const nim = user.email.split("@")[0];
      if (!nim) return;

      try {
        const res = await fetch(`/api/mahasiswa/${nim}`);
        if (res.ok) {
          const apiResponse = await res.json();
          setMahasiswa(apiResponse.data);
        }
      } catch (error) {
        console.error("Error fetching student data for Header:", error);
      }
    };

    fetchStudentData();
  }, [user]); // Jalankan setiap kali user berubah

  // Dummy notifikasi
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Tugas",
      message: "Tugas Pemrograman Web dikumpulkan besok",
      read: false,
    },
    {
      id: 2,
      type: "Presensi",
      message: "Presensi hari ini belum dilakukan",
      read: false,
    },
    {
      id: 3,
      type: "Pengumuman",
      message: "Libur nasional minggu depan",
      read: false,
    },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Tentukan nama dan gambar yang akan ditampilkan
  // Jika user adalah admin, gunakan data dari 'user' context
  // Jika user adalah mahasiswa, gunakan data dari state 'mahasiswa'
  const displayName =
    user?.role.toLowerCase() === "admin"
      ? user.name
      : mahasiswa?.nama || user?.name;
  const displayImage =
    user?.role.toLowerCase() === "admin"
      ? `https://ui-avatars.com/api/?name=${user.name}&background=0D47A1&color=fff&length=2`
      : `https://ui-avatars.com/api/?name=${
          displayName || "User"
        }&background=6366F1&color=fff&length=2`;

  return (
    <>
      <header className="bg-[#000e7c] shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                type="button"
                className="px-4 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
                onClick={onOpenSidebar}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-1.5">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Sistem Informasi Terpadu POLIBAN
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <DropdownMenu onOpenChange={(isOpen) => isOpen && handleOpen()}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none"
                    aria-label="View notifications"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-600 bg-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <DropdownMenuItem>Tidak ada notifikasi</DropdownMenuItem>
                  ) : (
                    notifications.map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        className={
                          !notif.read ? "font-semibold" : "text-gray-500"
                        }
                      >
                        <div>
                          <div className="text-xs text-gray-400">
                            {notif.type}
                          </div>
                          <div>{notif.message}</div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* PERUBAHAN 4: Logika penampilan profil di header disesuaikan */}
              <div className="ml-4 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={displayImage}
                    alt="Profile"
                  />
                  <span className="hidden md:flex ml-2 text-sm font-medium text-white">
                    {displayName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
