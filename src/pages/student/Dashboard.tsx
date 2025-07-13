import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Award,
  BarChart2,
  X,
  User,
  Home,
  Hash,
  Loader2, // Impor Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// --- DEFINISI INTERFACE ---
// 💡 DIUBAH: Interface Mahasiswa disesuaikan untuk data dashboard
interface Mahasiswa {
  nim: string;
  nama: string;
  id_prodi: number | null;
  id_pegawai: string | null;
}

// 💡 BARU: Interface untuk data Dosen/Pegawai
interface Pegawai {
  id_pegawai: string;
  nama_pegawai: string;
}

// 💡 BARU: Interface untuk data Prodi
interface Prodi {
  id_prodi: number;
  nama_prodi: string;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getStudentCourses, enrollments } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // 💡 DIUBAH: State untuk data dinamis
  const [studentData, setStudentData] = useState<Mahasiswa | null>(null);
  const [dosenWali, setDosenWali] = useState<Pegawai | null>(null);
  const [prodi, setProdi] = useState<Prodi | null>(null);
  const [loading, setLoading] = useState(true);

  // 💡 DIUBAH: Mengambil semua data yang diperlukan untuk dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user.email) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const nim = user.email.split("@")[0];

      try {
        // Mengambil data mahasiswa dan daftar dosen/prodi secara paralel
        const [mahasiswaRes, pegawaiRes, prodiRes] = await Promise.all([
          fetch(`/api/mahasiswa/${nim}`),
          fetch("https://ti054c02.agussbn.my.id/api/data/pegawai/dosen/"),
          fetch("https://ti054c02.agussbn.my.id/api/data/prodi"),
        ]);

        if (!mahasiswaRes.ok) throw new Error("Gagal mengambil data mahasiswa");
        if (!pegawaiRes.ok) throw new Error("Gagal mengambil data dosen");
        if (!prodiRes.ok) throw new Error("Gagal mengambil data prodi");

        const mahasiswaApiResponse = await mahasiswaRes.json();
        const pegawaiApiResponse = await pegawaiRes.json();
        const prodiApiResponse = await prodiRes.json();

        if (!mahasiswaApiResponse.data)
          throw new Error("Data mahasiswa tidak ditemukan.");

        const currentStudent: Mahasiswa = mahasiswaApiResponse.data;
        const allPegawai: Pegawai[] = pegawaiApiResponse.data || [];
        const allProdi: Prodi[] = prodiApiResponse.data || [];

        // Set data mahasiswa
        setStudentData(currentStudent);

        // Cari dan set dosen wali
        if (currentStudent.id_pegawai) {
          const foundDosen = allPegawai.find(
            (p) => p.id_pegawai === currentStudent.id_pegawai
          );
          setDosenWali(foundDosen || null);
        }

        // Cari dan set prodi
        if (currentStudent.id_prodi) {
          const foundProdi = allProdi.find(
            (p) => p.id_prodi === currentStudent.id_prodi
          );
          setProdi(foundProdi || null);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Gagal memuat data",
          description: "Tidak dapat mengambil data untuk dashboard.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Sisa logika (tidak ada perubahan signifikan)
  const studentId = user ? String(user.id) : "";
  const studentCourses = getStudentCourses(studentId);
  const totalCredits = studentCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );
  const averageAttendance =
    enrollments.length > 0
      ? enrollments.reduce(
          (sum, enrollment) => sum + enrollment.attendancePercentage,
          0
        ) / enrollments.length
      : 0;

  const upcomingCourses = [
    {
      id: "1",
      name: "Pemrograman Web",
      code: "IF2023",
      lecturer: "Agus Setiyo Budi Nugroho, S.Kom., M.Kom.",
      credits: 3,
      time: "Senin, 13:00 - 15:30",
      room: "Lab Komputer 3",
    },
    {
      id: "2",
      name: "Kecerdasan Buatan",
      code: "IF2025",
      lecturer: "Frista Rizky Rinandi, S.Kom., M.Kom.",
      credits: 3,
      time: "Rabu, 08:00 - 10:30",
      room: "Ruang 2.3",
    },
  ];
  const recentActivity = [
    {
      id: "1",
      type: "attendance",
      course: "Pemrograman Web",
      date: "2023-09-15",
      status: "present",
    },
    {
      id: "2",
      type: "grade",
      course: "Struktur Data",
      assignment: "Tugas 3",
      grade: "A",
    },
    { id: "3", type: "announcement", title: "Jadwal UTS", date: "2023-09-12" },
  ];
  const openModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  if (loading || !studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="ml-4 text-lg text-gray-600">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="rounded-xl bg-kampus-primary p-6 md:p-8 shadow-lg text-white flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">
            Selamat Datang, {studentData.nama}!
          </h2>
          {/* 💡 DIUBAH: Prodi dinamis */}
          <p className="mt-1 text-base text-indigo-200">
            {prodi?.nama_prodi || "Program Studi"} - Semester 4
          </p>
          <span className="inline-block mt-4 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500 text-white">
            Status: Aktif
            <CheckCircle className="inline h-4 w-4 ml-1.5" />
          </span>
        </div>
        <div className="mt-6 md:mt-0 text-left md:text-right space-y-2">
          <div className="text-sm md:text-base font-medium">
            NIM:{" "}
            <span className="font-bold tracking-wide">{studentData.nim}</span>
          </div>
          <div className="text-sm md:text-base font-medium">
            Dosen Wali: {/* 💡 DIUBAH: Dosen Wali dinamis */}
            <span className="font-bold">
              {dosenWali?.nama_pegawai || "Belum ditentukan"}
            </span>
          </div>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 cursor-pointer">
          <div className="flex items-center mb-2">
            <FileText className="h-5 w-5 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-gray-500">
              Mata Kuliah Diambil
            </span>
          </div>
          <div className="text-2xl font-bold text-indigo-900 ml-2">
            {studentCourses.length}
          </div>
          <div className="w-full pt-2 px-0">
            <div className="shadow-[0_4px_8px_-4px_rgba(99,102,241,0.15)] rounded-b-xl">
              <Link
                to="/matakuliah"
                className="block text-xs text-indigo-600 hover:underline px-4 py-2"
              >
                Lihat detail
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 cursor-pointer">
          <div className="flex items-center mb-2">
            <BarChart2 className="h-5 w-5 text-purple-500 mr-2" />
            <span className="text-sm font-medium text-gray-500">Total SKS</span>
          </div>
          <div className="text-2xl font-bold text-indigo-900 ml-2">
            {totalCredits}
          </div>
          <div className="w-full pt-2 px-0">
            <div className="shadow-[0_4px_8px_-4px_rgba(99,102,241,0.15)] rounded-b-xl">
              <Link
                to="/khs"
                className="block text-xs text-indigo-600 hover:underline px-4 py-2"
              >
                Lihat KHS
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 cursor-pointer">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
            <span className="text-sm font-medium text-gray-500">
              Rata-rata Kehadiran
            </span>
          </div>
          <div className="text-2xl font-bold text-indigo-900 ml-2">
            {averageAttendance.toFixed(1)}%
          </div>
          <div className="w-full pt-2 px-0">
            <div className="shadow-[0_4px_8px_-4px_rgba(99,102,241,0.15)] rounded-b-xl">
              <Link
                to="/presensi"
                className="block text-xs text-indigo-600 hover:underline px-4 py-2"
              >
                Lihat presensi
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-start border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 cursor-pointer">
          <div className="flex items-center mb-2">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-500">IPK</span>
          </div>
          <div className="text-2xl font-bold text-indigo-900 ml-2">3.75</div>
          <div className="w-full pt-2 px-0">
            <div className="shadow-[0_4px_8px_-4px_rgba(99,102,241,0.15)] rounded-b-xl">
              <Link
                to="/khs"
                className="block text-xs text-indigo-600 hover:underline px-4 py-2"
              >
                Lihat transkrip
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Jadwal Kuliah & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2 border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Jadwal Kuliah Mendatang
          </h3>
          {upcomingCourses.length > 0 ? (
            <ul className="space-y-4">
              {upcomingCourses.map((course) => (
                <li
                  key={course.id}
                  className="flex items-center justify-between border-b last:border-b-0 pb-3"
                >
                  <div>
                    <div className="font-medium text-indigo-800">
                      {course.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.time} • {course.room}
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(course)}
                    className="inline-flex items-center px-3 py-1 border border-indigo-200 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Detail
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Tidak ada jadwal kuliah dalam waktu dekat.
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Aktivitas Terbaru
          </h3>
          {recentActivity.length > 0 ? (
            <ul className="space-y-4">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start gap-3">
                  {activity.type === "attendance" && (
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-1" />
                  )}
                  {activity.type === "grade" && (
                    <Award className="h-5 w-5 text-yellow-500 mt-1" />
                  )}
                  {activity.type === "announcement" && (
                    <FileText className="h-5 w-5 text-blue-500 mt-1" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {activity.type === "attendance" &&
                        `Presensi ${activity.course}`}
                      {activity.type === "grade" &&
                        `Nilai ${activity.assignment}: ${activity.grade}`}
                      {activity.type === "announcement" && activity.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.type === "attendance" &&
                        new Date(activity.date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      {activity.type === "grade" && activity.course}
                      {activity.type === "announcement" &&
                        new Date(activity.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Tidak ada aktivitas terbaru.
            </p>
          )}
        </div>
      </div>

      {/* Modal Detail Jadwal */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in-fast">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Detail Mata Kuliah
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-xl font-bold text-indigo-700">
                  {selectedCourse.name}
                </h4>
                <p className="text-sm text-gray-500">
                  Kode: {selectedCourse.code}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Dosen Pengampu</p>
                    <p className="font-medium text-gray-800">
                      {selectedCourse.lecturer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Jadwal</p>
                    <p className="font-medium text-gray-800">
                      {selectedCourse.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Ruang</p>
                    <p className="font-medium text-gray-800">
                      {selectedCourse.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">SKS</p>
                    <p className="font-medium text-gray-800">
                      {selectedCourse.credits}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-b-xl text-right">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
