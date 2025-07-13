import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Home,
  Loader2,
  GraduationCap, // 💡 BARU: Impor ikon baru
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// --- DEFINISI INTERFACE ---
interface Mahasiswa {
  nim: string;
  nama: string;
  email: string;
  nomor_hp: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat_lengkap: string;
  image: string | null;
  id_prodi: number | null;
  id_kelas: string;
  tahun_masuk: number;
}

// 💡 BARU: Interface untuk data Prodi
interface Prodi {
  id_prodi: number;
  nama_prodi: string;
  jenjang: string;
  id_jurusan: number;
}

// 💡 BARU: Interface untuk data Jurusan
interface Jurusan {
  id_jurusan: number;
  nama_jurusan: string;
}

const StudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<Mahasiswa | null>(null);

  // 💡 BARU: State untuk menyimpan data prodi dan jurusan
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);

  useEffect(() => {
    // 💡 DIUBAH: Mengambil semua data yang diperlukan secara bersamaan
    const fetchAllData = async () => {
      if (!user || !user.email) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const nim = user.email.split("@")[0];

      try {
        // Menggunakan Promise.all untuk fetch data secara paralel
        const [mahasiswaRes, prodiRes, jurusanRes] = await Promise.all([
          fetch(`https://ti054c03.agussbn.my.id/api/mahasiswa/${nim}`),
          fetch("https://ti054c02.agussbn.my.id/api/data/prodi"),
          fetch("https://ti054c02.agussbn.my.id/api/data/jurusan"),
        ]);

        if (!mahasiswaRes.ok) throw new Error("Gagal mengambil data mahasiswa");
        if (!prodiRes.ok) throw new Error("Gagal mengambil data prodi");
        if (!jurusanRes.ok) throw new Error("Gagal mengambil data jurusan");

        const mahasiswaApiResponse = await mahasiswaRes.json();
        const prodiApiResponse = await prodiRes.json();
        const jurusanApiResponse = await jurusanRes.json();

        if (!mahasiswaApiResponse.data)
          throw new Error("Data mahasiswa tidak ditemukan.");

        setStudentData(mahasiswaApiResponse.data);
        setProdiList(prodiApiResponse.data || []);
        setJurusanList(jurusanApiResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Gagal memuat data",
          description: (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const formatTanggalLahir = (tanggal: string) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // 💡 BARU: Mencari nama prodi dan jurusan berdasarkan data mahasiswa
  const prodiInfo =
    studentData && prodiList.find((p) => p.id_prodi === studentData.id_prodi);
  const jurusanInfo =
    prodiInfo && jurusanList.find((j) => j.id_jurusan === prodiInfo.id_jurusan);

  const DetailRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
  }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500 flex items-center">
        <Icon className="h-5 w-5 mr-3 text-gray-400" />
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {value || "-"}
      </dd>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="ml-4 text-lg text-gray-600">Memuat data profil...</p>
      </div>
    );
  }
  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h3 className="text-lg font-medium text-red-600">
            Gagal memuat data profil.
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Pastikan Anda sudah login dan data profil tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">
          Profil Mahasiswa
        </h3>
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
              src={`https://ui-avatars.com/api/?name=${studentData.nama}&background=312e81&color=fff&size=128&length=2`}
              alt={`Inisial ${studentData.nama}`}
            />

            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                {studentData.nama}
              </h2>
              <p className="text-md text-indigo-700 font-mono mt-1">
                NIM: {studentData.nim}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            {/* --- 💡 BARU: Menampilkan Jurusan dan Prodi --- */}
            <DetailRow
              icon={GraduationCap}
              label="Jurusan"
              value={jurusanInfo?.nama_jurusan || "Data tidak ditemukan"}
            />
            <DetailRow
              icon={GraduationCap}
              label="Program Studi"
              value={
                prodiInfo
                  ? `${prodiInfo.nama_prodi} (${prodiInfo.jenjang})`
                  : "Data tidak ditemukan"
              }
            />
            {/* --- AKHIR PERUBAHAN --- */}

            <DetailRow
              icon={Mail}
              label="Alamat Email"
              value={studentData.email}
            />
            <DetailRow
              icon={Phone}
              label="No. Handphone"
              value={studentData.nomor_hp}
            />
            <DetailRow
              icon={MapPin}
              label="Tempat Lahir"
              value={studentData.tempat_lahir}
            />
            <DetailRow
              icon={Calendar}
              label="Tanggal Lahir"
              value={formatTanggalLahir(studentData.tanggal_lahir)}
            />
            <DetailRow
              icon={Home}
              label="Alamat"
              value={studentData.alamat_lengkap}
            />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
