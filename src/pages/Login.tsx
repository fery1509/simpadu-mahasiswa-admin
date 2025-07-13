import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

// PERUBAHAN 1: Hapus import untuk logo yang tidak dipakai
import bgPoliban from "@/assets/images/poliban-building.jpg";
import logoUniv from "@/assets/images/logo-univ.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("kampusUser");
    localStorage.removeItem("kampusAdmin");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser) {
        if (loggedInUser.role.toLowerCase() === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login submission error:", err);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <img
          src={bgPoliban}
          alt="Poliban Building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 p-8 rounded-xl backdrop-blur-md bg-white/30 shadow-xl border border-white/30">
          {/* PERUBAHAN 2: Hapus elemen <img> untuk logo SIMAK & Kampus Merdeka */}
          <div className="flex justify-center items-center gap-6">
            <img
              src={logoUniv}
              alt="Logo Universitas"
              className="h-20 w-auto" // Ukuran sedikit dibesarkan agar proporsional
            />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Masuk ke SIMPADU
            </h2>
            <p className="text-base text-white/80">
              Akses Mudah, Akademik Lancar
            </p>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 bg-white/50 backdrop-blur-sm placeholder:text-gray-500 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Kata sandi anda
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 bg-white/50 backdrop-blur-sm placeholder:text-gray-500 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm font-medium text-white hover:text-white/80 transition-colors"
              >
                Lupa kata sandi?
              </a>
            </div>

            {error && (
              <div className="bg-red-500/50 backdrop-blur-sm border border-red-300/50 text-white px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
