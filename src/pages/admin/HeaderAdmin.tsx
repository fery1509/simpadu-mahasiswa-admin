import { useAuth } from "@/context/AuthContext";
import { Bell, Menu } from "lucide-react";

interface HeaderAdminProps {
  onOpenSidebar: () => void;
}

const HeaderAdmin = ({ onOpenSidebar }: HeaderAdminProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-[#000e7c] sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {/* Tombol menu untuk mobile */}
            <button
              type="button"
              className="px-4 text-white focus:outline-none md:hidden"
              onClick={onOpenSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* ====================================================== */}
            {/* PERUBAHAN DI SINI: Teks dan gaya disamakan */}
            {/* ====================================================== */}
            <div className="flex items-center ml-1.5">
              <span className="text-xl font-extrabold text-white tracking-tight">
                Sistem Informasi Terpadu POLIBAN
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="relative p-1 rounded-full text-gray-300 hover:text-white focus:outline-none"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center">
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={`https://ui-avatars.com/api/?name=${
                    user?.name || "Admin"
                  }&background=1e3269&color=fff`}
                  alt="Profile"
                />
              </div>
              <div className="hidden md:flex flex-col ml-3 items-start">
                <span className="text-sm font-semibold text-white leading-tight">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-300 leading-tight">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
