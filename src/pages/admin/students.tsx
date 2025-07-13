import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  Eye,
  Calendar as CalendarIcon,
  PlusCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import SidebarAdmin from "./SidebarAdmin";
import HeaderAdmin from "./HeaderAdmin";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addYears, subYears } from "date-fns";
import { id } from "date-fns/locale";
import { CaptionProps, useNavigation } from "react-day-picker";
import { cn } from "@/lib/utils";

// --- DEFINISI INTERFACE ---
interface Student {
  nim: string;
  nama: string;
  email: string;
  nomor_hp: string;
  tempat_lahir: string;
  tanggal_lahir: string | Date;
  alamat_lengkap: string;
  image: string | null;
  id_prodi: number | null;
  id_pegawai: string | null;
  tahun_masuk: number | string;
  id_jk: number | null;
  id_agama: number | null;
  id_kabupaten: string | null;
  id_kelas: string | null;
}

interface Pegawai {
  id_pegawai: string;
  nama_pegawai: string;
}

interface Prodi {
  id_prodi: number;
  nama_prodi: string;
  jenjang: string;
  id_jurusan: number;
}

interface Jurusan {
  id_jurusan: number;
  nama_jurusan: string;
}

// Data mahasiswa kosong untuk inisialisasi form
const emptyStudent: Student = {
  nim: "",
  nama: "",
  email: "",
  nomor_hp: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  alamat_lengkap: "",
  image: null,
  id_prodi: null,
  id_pegawai: "",
  tahun_masuk: new Date().getFullYear(),
  id_jk: 1,
  id_agama: 1,
  id_kabupaten: "",
  id_kelas: "",
};

// Komponen kustom untuk navigasi kalender
function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  return (
    <div className="flex justify-between items-center h-10 px-2 relative">
      <h2 className="text-sm font-medium absolute left-1/2 -translate-x-1/2">
        {format(props.displayMonth, "MMMM yyyy", { locale: id })}
      </h2>
      <div className="flex items-center space-x-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => goToMonth(subYears(props.displayMonth, 1))}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={!previousMonth}
          onClick={() => previousMonth && goToMonth(previousMonth)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={!nextMonth}
          onClick={() => nextMonth && goToMonth(nextMonth)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => goToMonth(addYears(props.displayMonth, 1))}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// --- KOMPONEN FORM MAHASISWA ---
const StudentForm = ({
  student,
  setStudent,
  pegawaiList,
  prodiList,
  jurusanList,
  isViewMode = false,
  isEditMode = false,
}: {
  student: Student;
  setStudent: (student: Student) => void;
  pegawaiList: Pegawai[];
  prodiList: Prodi[];
  jurusanList: Jurusan[];
  isViewMode?: boolean;
  isEditMode?: boolean;
}) => {
  const [selectedJurusan, setSelectedJurusan] = useState<number | null>(null);

  useEffect(() => {
    if (student.id_prodi && prodiList.length > 0) {
      const prodi = prodiList.find((p) => p.id_prodi === student.id_prodi);
      if (prodi) {
        setSelectedJurusan(prodi.id_jurusan);
      }
    } else {
      setSelectedJurusan(null);
    }
  }, [student.id_prodi, prodiList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleSelectChange = (
    name: keyof Student | "id_jurusan",
    value: string
  ) => {
    if (name === "id_jurusan") {
      const jurusanId = parseInt(value);
      setSelectedJurusan(jurusanId);
      setStudent({ ...student, id_prodi: null });
    } else {
      const isNumericId = ["id_prodi", "id_jk", "id_agama"].includes(name);
      setStudent({ ...student, [name]: isNumericId ? parseInt(value) : value });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setStudent({ ...student, tanggal_lahir: date || "" });
  };

  const filteredProdi = useMemo(() => {
    if (!selectedJurusan) return [];
    return prodiList.filter((p) => p.id_jurusan === selectedJurusan);
  }, [selectedJurusan, prodiList]);

  const renderField = (label: string, value: any) => (
    <div className="space-y-1">
      <Label className="text-sm font-semibold text-gray-500">{label}</Label>
      <div className="w-full p-3 border rounded-md bg-gray-50 text-gray-800 min-h-[42px] flex items-center">
        {value || "-"}
      </div>
    </div>
  );

  if (isViewMode) {
    const dosenPA =
      pegawaiList.find((p) => p.id_pegawai === student.id_pegawai)
        ?.nama_pegawai || student.id_pegawai;
    const prodi = prodiList.find((p) => p.id_prodi === student.id_prodi);
    const prodiName = prodi?.nama_prodi || student.id_prodi;
    const jurusanName =
      jurusanList.find((j) => j.id_jurusan === prodi?.id_jurusan)
        ?.nama_jurusan || "-";

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
        <div className="md:col-span-2 flex items-center gap-4 border-b pb-4 mb-2">
          <img
            src={
              student.image
                ? student.image
                : `https://ui-avatars.com/api/?name=${student.nama.replace(
                    " ",
                    "+"
                  )}&background=0D47A1&color=fff&length=2`
            }
            alt={student.nama}
            className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 shadow"
          />
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-blue-900">{student.nama}</h3>
            <p className="text-gray-500 font-mono">{student.nim}</p>
          </div>
        </div>
        {renderField("Email", student.email)}
        {renderField("Nomor HP", student.nomor_hp)}
        {renderField("Tempat Lahir", student.tempat_lahir)}
        {renderField(
          "Tanggal Lahir",
          student.tanggal_lahir
            ? format(new Date(student.tanggal_lahir), "d MMMM yyyy", {
                locale: id,
              })
            : "-"
        )}
        {renderField("Alamat Lengkap", student.alamat_lengkap)}
        {renderField("Kelas", student.id_kelas)}
        {renderField("Tahun Masuk", student.tahun_masuk)}
        {renderField("Dosen Pembimbing", dosenPA)}
        {renderField("Jurusan", jurusanName)}
        {renderField("Program Studi", prodiName)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
      <div className="space-y-1">
        <Label htmlFor="nim">
          NIM<span className="text-rose-500">*</span>
        </Label>
        <Input
          id="nim"
          name="nim"
          placeholder="C030323XXX"
          value={student.nim}
          onChange={handleInputChange}
          required
          disabled={isEditMode}
          className={isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="nama">
          Nama<span className="text-rose-500">*</span>
        </Label>
        <Input
          id="nama"
          name="nama"
          placeholder="Nama Lengkap"
          value={student.nama}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">
          Email<span className="text-rose-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="contoh@mahasiswa.poliban.ac.id"
          value={student.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="nomor_hp">
          Nomor HP<span className="text-rose-500">*</span>
        </Label>
        <Input
          id="nomor_hp"
          name="nomor_hp"
          placeholder="08..."
          value={student.nomor_hp}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="tempat_lahir">
          Tempat Lahir<span className="text-rose-500">*</span>
        </Label>
        <Input
          id="tempat_lahir"
          name="tempat_lahir"
          placeholder="Contoh: Banjarmasin"
          value={student.tempat_lahir}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="tanggal_lahir">
          Tanggal Lahir<span className="text-rose-500">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !student.tanggal_lahir && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {student.tanggal_lahir ? (
                format(new Date(student.tanggal_lahir), "PPP", { locale: id })
              ) : (
                <span>Pilih tanggal</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              components={{ Caption: CustomCaption }}
              selected={
                student.tanggal_lahir
                  ? new Date(student.tanggal_lahir)
                  : undefined
              }
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="md:col-span-2 space-y-1">
        <Label htmlFor="alamat_lengkap">
          Alamat Lengkap<span className="text-rose-500">*</span>
        </Label>
        <Input
          id="alamat_lengkap"
          name="alamat_lengkap"
          placeholder="Alamat Lengkap"
          value={student.alamat_lengkap}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="id_pegawai">
          Dosen PA<span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => handleSelectChange("id_pegawai", value)}
          value={student.id_pegawai || ""}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="-- Pilih Dosen PA --" />
          </SelectTrigger>
          <SelectContent>
            {pegawaiList.map((pegawai) => (
              <SelectItem key={pegawai.id_pegawai} value={pegawai.id_pegawai}>
                {pegawai.nama_pegawai} ({pegawai.id_pegawai})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="id_kelas">
          Kelas<span className="text-rose-500">*</span>
        </Label>
        <Input
          id="id_kelas"
          name="id_kelas"
          placeholder="Contoh: TI-4C"
          value={student.id_kelas || ""}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="id_jurusan">
          Jurusan<span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => handleSelectChange("id_jurusan", value)}
          value={String(selectedJurusan || "")}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="-- Pilih Jurusan --" />
          </SelectTrigger>
          <SelectContent>
            {jurusanList.map((jurusan) => (
              <SelectItem
                key={jurusan.id_jurusan}
                value={String(jurusan.id_jurusan)}
              >
                {jurusan.nama_jurusan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="id_prodi">
          Program Studi<span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => handleSelectChange("id_prodi", value)}
          value={String(student.id_prodi || "")}
          required
          disabled={!selectedJurusan}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !selectedJurusan ? "Pilih jurusan dulu" : "-- Pilih Prodi --"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {filteredProdi.map((prodi) => (
              <SelectItem key={prodi.id_prodi} value={String(prodi.id_prodi)}>
                {prodi.nama_prodi} ({prodi.jenjang})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="tahun_masuk">
          Tahun Masuk<span className="text-rose-500">*</span>
        </Label>
        <Input
          id="tahun_masuk"
          name="tahun_masuk"
          placeholder="Tahun Masuk"
          type="number"
          value={String(student.tahun_masuk)}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="id_jk">
          Jenis Kelamin<span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => handleSelectChange("id_jk", value)}
          value={String(student.id_jk || "")}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="-- Pilih Jenis Kelamin --" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Laki-laki</SelectItem>
            <SelectItem value="2">Perempuan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="id_agama">
          Agama<span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => handleSelectChange("id_agama", value)}
          value={String(student.id_agama || "")}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="-- Pilih Agama --" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Islam</SelectItem>
            <SelectItem value="2">Kristen</SelectItem>
            <SelectItem value="3">Katolik</SelectItem>
            <SelectItem value="4">Hindu</SelectItem>
            <SelectItem value="5">Buddha</SelectItem>
            <SelectItem value="6">Konghucu</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA HALAMAN ---
const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogState, setDialogState] = useState<
    "add" | "edit" | "view" | null
  >(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student>(emptyStudent);

  // 💡 BARU: State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const fetchStudents = async () => {
    // Fungsi ini tidak perlu diubah
    try {
      const response = await fetch("/api/mahasiswa");
      if (!response.ok) throw new Error("Gagal mengambil data mahasiswa");
      const apiResponse = await response.json();
      setStudents(apiResponse.data || []);
    } catch (error) {
      console.error("Fetch Students Error:", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Tidak dapat memuat data mahasiswa dari server.",
      });
    }
  };

  const fetchPegawai = async () => {
    // Fungsi ini tidak perlu diubah
    try {
      const response = await fetch(
        "https://ti054c02.agussbn.my.id/api/data/pegawai/dosen/"
      );
      if (!response.ok) throw new Error("Gagal mengambil data dosen");
      const apiResponse = await response.json();
      if (apiResponse.success) {
        setPegawaiList(apiResponse.data || []);
      } else {
        throw new Error(apiResponse.message || "Gagal mengambil data dosen");
      }
    } catch (error) {
      console.error("Fetch Pegawai Error:", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Tidak dapat memuat data dosen dari server.",
      });
    }
  };

  const fetchProdi = async () => {
    // Fungsi ini tidak perlu diubah
    try {
      const response = await fetch(
        "https://ti054c02.agussbn.my.id/api/data/prodi"
      );
      if (!response.ok) throw new Error("Gagal mengambil data prodi");
      const apiResponse = await response.json();
      if (apiResponse.success) {
        setProdiList(apiResponse.data || []);
      } else {
        throw new Error(apiResponse.message || "Gagal mengambil data prodi");
      }
    } catch (error) {
      console.error("Fetch Prodi Error:", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Tidak dapat memuat data prodi dari server.",
      });
    }
  };

  const fetchJurusan = async () => {
    // Fungsi ini tidak perlu diubah
    try {
      const response = await fetch(
        "https://ti054c02.agussbn.my.id/api/data/jurusan"
      );
      if (!response.ok) throw new Error("Gagal mengambil data jurusan");
      const apiResponse = await response.json();
      if (apiResponse.success) {
        setJurusanList(apiResponse.data || []);
      } else {
        throw new Error(apiResponse.message || "Gagal mengambil data jurusan");
      }
    } catch (error) {
      console.error("Fetch Jurusan Error:", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Tidak dapat memuat data jurusan dari server.",
      });
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStudents(),
        fetchPegawai(),
        fetchProdi(),
        fetchJurusan(),
      ]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (mhs) =>
          mhs.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mhs.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mhs.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [students, searchQuery]
  );

  // 💡 BARU: Logika untuk data yang akan ditampilkan di halaman saat ini
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleAdd = () => {
    setCurrentStudent(emptyStudent);
    setDialogState("add");
  };
  const handleEdit = (student: Student) => {
    setCurrentStudent(student);
    setDialogState("edit");
  };
  const handleView = (student: Student) => {
    setCurrentStudent(student);
    setDialogState("view");
  };
  const openDeleteConfirmation = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Fungsi ini tidak perlu diubah
    e.preventDefault();
    let formattedDate = "";
    if (currentStudent.tanggal_lahir) {
      formattedDate =
        currentStudent.tanggal_lahir instanceof Date
          ? format(currentStudent.tanggal_lahir, "yyyy-MM-dd")
          : new Date(currentStudent.tanggal_lahir).toISOString().split("T")[0];
    }
    const payload = {
      ...currentStudent,
      tanggal_lahir: formattedDate,
      tahun_masuk: Number(currentStudent.tahun_masuk),
    };
    const isAdding = dialogState === "add";
    const url = isAdding
      ? "/api/tambah-mahasiswa"
      : `/api/ubah-mahasiswa/${currentStudent.nim}`;
    const method = isAdding ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Operasi gagal.");
      toast({
        title: "Berhasil!",
        description: result.message || "Operasi berhasil disimpan.",
      });
      setDialogState(null);
      fetchStudents();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: (error as Error).message,
      });
    }
  };

  const handleDelete = async () => {
    // Fungsi ini tidak perlu diubah
    if (!studentToDelete) return;
    try {
      const response = await fetch(
        `/api/hapus-mahasiswa/${studentToDelete.nim}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal menghapus data.");
      toast({
        title: "Dihapus!",
        description: result.message || "Data berhasil dihapus.",
      });
      setStudentToDelete(null);
      fetchStudents();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarAdmin />
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <HeaderAdmin onOpenSidebar={() => {}} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-8 px-4 sm:px-6 md:px-8">
            <Card className="bg-white border-none shadow-lg rounded-2xl">
              <CardHeader className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 p-6">
                <CardTitle className="text-2xl font-bold text-blue-900">
                  Data Mahasiswa
                </CardTitle>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Input
                    className="w-full md:w-64 border-gray-300 rounded-lg"
                    placeholder="Cari mahasiswa..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-2"
                  >
                    <PlusCircle size={18} /> Tambah
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50 hover:bg-blue-100/50">
                      <TableHead className="text-blue-800 font-semibold">
                        NIM
                      </TableHead>
                      <TableHead className="text-blue-800 font-semibold">
                        Nama
                      </TableHead>
                      <TableHead className="text-blue-800 font-semibold">
                        Email
                      </TableHead>
                      <TableHead className="text-blue-800 font-semibold">
                        No. HP
                      </TableHead>
                      <TableHead className="text-blue-800 font-semibold text-center">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          Memuat data...
                        </TableCell>
                      </TableRow>
                    ) : paginatedStudents.length > 0 ? (
                      // 💡 DIUBAH: Menggunakan paginatedStudents
                      paginatedStudents.map((mhs) => (
                        <TableRow key={mhs.nim} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {mhs.nim}
                          </TableCell>
                          <TableCell>{mhs.nama}</TableCell>
                          <TableCell>{mhs.email}</TableCell>
                          <TableCell>{mhs.nomor_hp}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-blue-600"
                                onClick={() => handleView(mhs)}
                              >
                                <Eye className="h-5 w-5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-green-600"
                                onClick={() => handleEdit(mhs)}
                              >
                                <Pencil className="h-5 w-5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-rose-600"
                                onClick={() => openDeleteConfirmation(mhs)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-gray-500 py-10"
                        >
                          Tidak ada data ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              {/* 💡 BARU: Komponen Paginasi */}
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Dialog
        open={!!dialogState}
        onOpenChange={(isOpen) => !isOpen && setDialogState(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-blue-900">
              {dialogState === "add" && "Tambah Mahasiswa Baru"}
              {dialogState === "edit" && "Edit Data Mahasiswa"}
              {dialogState === "view" && "Detail Data Mahasiswa"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <StudentForm
              student={currentStudent}
              setStudent={setCurrentStudent}
              pegawaiList={pegawaiList}
              prodiList={prodiList}
              jurusanList={jurusanList}
              isViewMode={dialogState === "view"}
              isEditMode={dialogState === "edit"}
            />
            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button variant="outline">
                  {dialogState === "view" ? "Tutup" : "Batal"}
                </Button>
              </DialogClose>
              {dialogState !== "view" && (
                <Button type="submit">
                  {dialogState === "add" ? "Simpan Data" : "Simpan Perubahan"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!studentToDelete}
        onOpenChange={(isOpen) => !isOpen && setStudentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Data mahasiswa dengan nama{" "}
              <strong>{studentToDelete?.nama}</strong> akan dihapus secara
              permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminStudents;
