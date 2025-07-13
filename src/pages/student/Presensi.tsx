import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const StudentPresensi = () => {
  const { user } = useAuth();
  const { getStudentCourses, getStudentAttendance, markAttendance } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // =======================================================================
  // PERBAIKAN DI SINI: Konversi user.id (angka) menjadi string secara eksplisit
  // =======================================================================
  const studentId = user ? String(user.id) : "";
  const courses = getStudentCourses(studentId);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleMarkAttendance = (
    courseId: string,
    status: "present" | "excused" | "sick"
  ) => {
    try {
      markAttendance(studentId, courseId, status);
      switch (status) {
        case "present":
          toast.success("Presensi Hadir berhasil direkam!");
          break;
        case "excused":
          toast.success("Keterangan Izin berhasil dikirim!");
          break;
        case "sick":
          toast.success("Keterangan Sakit berhasil dikirim!");
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error("Gagal merekam presensi. Coba lagi.");
      console.error("Attendance marking failed:", error);
    }
  };

  const statusMap = {
    present: { label: "Hadir", color: "bg-green-100 text-green-800" },
    absent: { label: "Tidak Hadir", color: "bg-red-100 text-red-800" },
    late: { label: "Terlambat", color: "bg-amber-100 text-amber-800" },
    excused: { label: "Izin", color: "bg-blue-100 text-blue-800" },
    sick: { label: "Sakit", color: "bg-red-100 text-red-800" },
  };

  const statusIconMap = {
    present: <CheckCircle className="h-5 w-5 text-green-500" />,
    absent: <XCircle className="h-5 w-5 text-red-500" />,
    late: <Clock className="h-5 w-5 text-amber-500" />,
    excused: <AlertCircle className="h-5 w-5 text-blue-500" />,
    sick: <XCircle className="h-5 w-5 text-red-500" />,
  };

  const calculateAttendancePercentage = (courseId: string) => {
    const attendances = getStudentAttendance(studentId, courseId);
    if (attendances.length === 0) return 0;
    const presentCount = attendances.filter(
      (a) => a.status === "present" || a.status === "excused"
    ).length;
    return Math.round((presentCount / attendances.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateOverallStatistics = () => {
    let totalSessions = 0;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    let sickCount = 0;

    courses.forEach((course) => {
      const attendances = getStudentAttendance(studentId, course.id);
      totalSessions += attendances.length;
      attendances.forEach((attendance) => {
        if (attendance.status === "present") presentCount++;
        else if (attendance.status === "absent") absentCount++;
        else if (attendance.status === "late") lateCount++;
        else if (attendance.status === "excused") excusedCount++;
        else if (attendance.status === "sick") sickCount++;
      });
    });

    return {
      totalSessions,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      sickCount,
      overallPercentage:
        totalSessions > 0
          ? Math.round(
              ((presentCount + excusedCount + sickCount) / totalSessions) * 100
            )
          : 0,
    };
  };

  const stats = calculateOverallStatistics();

  return (
    <div className="animate-fade-in">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">
          Presensi Kuliah
        </h3>
      </div>

      {/* Overall statistics */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Statistik Kehadiran
          </h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.overallPercentage}%
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Kehadiran Keseluruhan
                </div>
              </div>
              <div className="h-12 w-12 rounded-full flex items-center justify-center">
                {stats.overallPercentage >= 80 ? (
                  <CheckCircle className="h-10 w-10 text-green-500" />
                ) : stats.overallPercentage >= 60 ? (
                  <AlertCircle className="h-10 w-10 text-amber-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-500" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {stats.totalSessions}
                </div>
                <div className="text-sm text-gray-500">Total Pertemuan</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-green-600">
                  {stats.presentCount}
                </div>
                <div className="text-sm text-gray-500">Hadir</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-blue-600">
                  {stats.excusedCount}
                </div>
                <div className="text-sm text-gray-500">Izin</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-red-600">
                  {stats.sickCount}
                </div>
                <div className="text-sm text-gray-500">Sakit</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-red-600">
                  {stats.absentCount + stats.lateCount}
                </div>
                <div className="text-sm text-gray-500">Tidak Hadir</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mt-6 sm:flex sm:justify-between">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-kampus-primary focus:border-kampus-primary sm:text-sm"
              placeholder="Cari mata kuliah"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Course attendance list */}
      <div className="mt-6 space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const attendances = getStudentAttendance(studentId, course.id);
            const percentage = calculateAttendancePercentage(course.id);
            const isTodayCourse =
              course.name.toLowerCase() === "pengantar ilmu komputer";

            return (
              <div
                key={course.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => toggleCourseExpansion(course.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        {course.code}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {course.name}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {course.lecturer} • {percentage}% Kehadiran
                    </p>
                  </div>
                  <div className="flex gap-3 ml-auto">
                    <button
                      className={`px-4 py-2 rounded font-semibold ${
                        isTodayCourse
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isTodayCourse) {
                          handleMarkAttendance(course.id, "present");
                        }
                      }}
                      disabled={!isTodayCourse}
                    >
                      Hadir
                    </button>
                    <button
                      className={`px-4 py-2 rounded font-semibold ${
                        isTodayCourse
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isTodayCourse) {
                          handleMarkAttendance(course.id, "excused");
                        }
                      }}
                      disabled={!isTodayCourse}
                    >
                      Izin
                    </button>
                    <button
                      className={`px-4 py-2 rounded font-semibold ${
                        isTodayCourse
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isTodayCourse) {
                          handleMarkAttendance(course.id, "sick");
                        }
                      }}
                      disabled={!isTodayCourse}
                    >
                      Sakit
                    </button>
                  </div>
                  <div
                    onClick={() => toggleCourseExpansion(course.id)}
                    style={{ cursor: "pointer", marginLeft: "1rem" }}
                  >
                    {expandedCourse === course.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedCourse === course.id && (
                  <div className="p-5">
                    {attendances.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Tanggal
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {attendances.map((attendance) => (
                              <tr key={attendance.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    {formatDate(attendance.date)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {statusIconMap[attendance.status]}
                                    <span
                                      className={`ml-2 inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                        statusMap[attendance.status].color
                                      }`}
                                    >
                                      {statusMap[attendance.status].label}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-4">
                        Tidak ada data presensi untuk mata kuliah ini.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak ada mata kuliah
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tidak ada mata kuliah yang cocok dengan pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPresensi;
