import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipe data BERSIH yang akan kita gunakan di seluruh aplikasi (TANPA password)
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

// ========================================================================
// PERUBAHAN DI SINI: Buat interface baru untuk data yang datang dari API
// Interface ini memiliki semua properti dari User, DITAMBAH password.
// ========================================================================
interface UserFromAPI extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("kampusUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);

    let userId;
    if (email === "admin@admin.com") {
      userId = 2;
    } else if (email === "c030323022@mahasiswa.poliban.ac.id") {
      userId = 4;
    } else {
      setError("Email tidak terdaftar.");
      setLoading(false);
      return null;
    }

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data pengguna.");
      }

      const apiResponse = await response.json();

      // PERUBAHAN DI SINI: Gunakan tipe UserFromAPI untuk data dari fetch
      const fetchedUser: UserFromAPI = apiResponse.data;

      // SEKARANG, akses ke .password menjadi VALID karena tipe datanya benar
      if (fetchedUser && fetchedUser.password === password) {
        // Hapus password dari objek sebelum disimpan (ini juga sekarang valid)
        const { password: _, ...userToStore } = fetchedUser;

        // userToStore sekarang cocok dengan tipe 'User' (tanpa password)
        setUser(userToStore);
        localStorage.setItem("kampusUser", JSON.stringify(userToStore));
        setLoading(false);
        return userToStore;
      } else {
        throw new Error("Email atau kata sandi tidak valid.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoading(false);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kampusUser");
    localStorage.removeItem("kampusAdmin");
    window.location.href = "/simpadu/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
