import { useState, useEffect, useMemo } from "react";
import {
  Book,
  Calendar,
  User,
  Search,
  Library,
  Hash,
  ArrowLeft,
  Loader2,
  XCircle,
} from "lucide-react";

// --- INTERFACE ---
interface MataKuliahType {
  id: number;
  kode_matakuliah: string;
  nama_matakuliah: string;
  kode_prodi: string;
  sks: number;
  semester: number;
  kode_tahun_akademik: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

const MataKuliah = () => {
  const [courses, setCourses] = useState<MataKuliahType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<MataKuliahType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // 💡 DIUBAH: URL diubah untuk menggunakan proxy Vite yang sudah diatur
        const response = await fetch("/matakuliah");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Periksa apakah 'result.data' adalah sebuah array
        if (Array.isArray(result.data)) {
          setCourses(result.data);
        } else {
          // Jika tidak, lempar error karena format data tidak sesuai
          throw new Error("Format data dari API tidak sesuai.");
        }
      } catch (e: any) {
        setError(e.message);
        console.error("Gagal mengambil data mata kuliah:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali

  const openModal = (course: MataKuliahType) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCourse(null), 300);
  };

  const filteredCourses = useMemo(
    () =>
      // Tambahkan pengecekan `courses &&` untuk memastikan state tidak null/undefined
      courses &&
      courses.filter(
        (course) =>
          course.nama_matakuliah
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.kode_matakuliah
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      ),
    [courses, searchQuery]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-kampus-primary animate-spin" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Memuat Data
          </h3>
          <p className="mt-1 text-sm text-gray-500">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Gagal Memuat Data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Terjadi kesalahan: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Konten Utama Halaman */}
      <div
        className={`transition-all duration-300 ${
          isModalOpen ? "blur-sm" : "blur-none"
        }`}
      >
        <div className="pb-5 border-b border-gray-200">
          <h3 className="text-2xl font-bold leading-6 text-gray-900">
            Mata Kuliah
          </h3>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="max-w-lg w-full">
            <label htmlFor="search" className="sr-only">
              Cari mata kuliah
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Cari mata kuliah..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <button className="px-4 py-2 text-sm font-medium text-white bg-kampus-primary rounded-md shadow-sm">
              Semua
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm">
              Semester Ini
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => openModal(course)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {course.kode_matakuliah}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {course.sks} SKS
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-800">
                    {course.nama_matakuliah}
                  </h3>
                  <div className="mt-4 space-y-3 text-gray-600">
                    <div className="flex items-center">
                      <Library className="h-5 w-5 mr-3 text-gray-400" />
                      <span>Semester {course.semester}</span>
                    </div>
                    <div className="flex items-center">
                      <Hash className="h-5 w-5 mr-3 text-gray-400" />
                      <span>Prodi: {course.kode_prodi}</span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          course.status === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        Status: {course.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 transition-colors duration-300 group-hover:bg-blue-50">
                  <p className="w-full text-center text-sm font-semibold text-kampus-primary group-hover:text-kampus-accent">
                    Detail Kelas
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Book className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Tidak Ada Mata Kuliah
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Mata kuliah yang Anda cari tidak ditemukan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail Kelas */}
      {isModalOpen && selectedCourse && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 animate-fade-in-fast"
          onClick={closeModal}
        >
          <div
            className="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
              >
                <ArrowLeft size={24} />
              </button>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">
                Detail Mata Kuliah
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h4 className="text-2xl font-bold text-kampus-primary">
                  {selectedCourse.nama_matakuliah}
                </h4>
                <p className="text-gray-500 mt-1">
                  {selectedCourse.kode_matakuliah}
                </p>
                <hr className="my-4" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">SKS</p>
                    <p className="font-bold text-lg text-gray-800">
                      {selectedCourse.sks}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Semester</p>
                    <p className="font-bold text-lg text-gray-800">
                      {selectedCourse.semester}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCourse.status === "Aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedCourse.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h5 className="font-bold text-gray-800 mb-4">
                  Informasi Tambahan
                </h5>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <Library size={20} className="mr-3 text-gray-400" />
                      <span>Program Studi</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {selectedCourse.kode_prodi}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={20} className="mr-3 text-gray-400" />
                      <span>Tahun Akademik</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {selectedCourse.kode_tahun_akademik}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <User size={20} className="mr-3 text-gray-400" />
                      <span>Dibuat Oleh</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {selectedCourse.created_by}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MataKuliah;
