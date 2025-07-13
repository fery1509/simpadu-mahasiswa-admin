import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { FileText, BarChart2, Award, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";

const KHS = () => {
  const { user } = useAuth();
  const { getStudentCourses, enrollments, currentTerm } = useData();

  // Get student data
  const studentId = user?.id as string;
  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === studentId
  );

  // Mock semester data
  const semesters = [
    { id: "1", name: "Semester 1 (Ganjil 2023/2024)", active: false },
    { id: "2", name: "Semester 2 (Genap 2023/2024)", active: false },
    { id: "3", name: "Semester 3 (Ganjil 2024/2025)", active: false },
    { id: "4", name: "Semester 4 (Genap 2024/2025)", active: false },
  ];

  // Mock courses data per semester
  const semesterCourses = {
    "1": [
      {
        code: "CSC101",
        name: "Pengantar Ilmu Komputer",
        credits: 3,
        grade: "A",
      },
      { code: "MAT101", name: "Kalkulus I", credits: 3, grade: "A-" },
      { code: "ENG101", name: "Bahasa Inggris I", credits: 2, grade: "B+" },
      { code: "PHY101", name: "Fisika Dasar", credits: 3, grade: "B" },
    ],
    "2": [
      {
        code: "CSC102",
        name: "Algoritma dan Pemrograman",
        credits: 4,
        grade: "A",
      },
      { code: "MAT102", name: "Kalkulus II", credits: 3, grade: "B+" },
      { code: "ENG102", name: "Bahasa Inggris II", credits: 2, grade: "A-" },
      { code: "CHE101", name: "Kimia Dasar", credits: 3, grade: "B" },
    ],
    "3": [
      { code: "CSC201", name: "Struktur Data", credits: 4, grade: "A-" },
      { code: "CSC202", name: "Sistem Digital", credits: 3, grade: "B+" },
      { code: "MAT201", name: "Matematika Diskrit", credits: 3, grade: "A" },
      {
        code: "STA201",
        name: "Probabilitas dan Statistika",
        credits: 3,
        grade: "B",
      },
    ],
    "4": [
      { code: "CSC203", name: "Arsitektur Komputer", credits: 3, grade: "B+" },
      { code: "CSC204", name: "Basis Data", credits: 4, grade: "A" },
      {
        code: "CSC205",
        name: "Pemrograman Berorientasi Objek",
        credits: 4,
        grade: "A-",
      },
      { code: "MAT202", name: "Aljabar Linear", credits: 3, grade: "B" },
    ],
  };

  // Calculate GPA for a semester
  const calculateSemesterGPA = (semesterId: string) => {
    const courses =
      semesterCourses[semesterId as keyof typeof semesterCourses] || [];
    let totalGradePoints = 0;
    let totalCredits = 0;
    courses.forEach((course) => {
      if (course.grade) {
        const gradePoint = getGradePoint(course.grade);
        totalGradePoints += gradePoint * course.credits;
        totalCredits += course.credits;
      }
    });
    return totalCredits > 0
      ? (totalGradePoints / totalCredits).toFixed(2)
      : "-";
  };

  // Calculate cumulative GPA
  const calculateCumulativeGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;
    Object.keys(semesterCourses).forEach((semesterId) => {
      const courses =
        semesterCourses[semesterId as keyof typeof semesterCourses] || [];
      courses.forEach((course) => {
        if (course.grade) {
          const gradePoint = getGradePoint(course.grade);
          totalGradePoints += gradePoint * course.credits;
          totalCredits += course.credits;
        }
      });
    });
    return totalCredits > 0
      ? (totalGradePoints / totalCredits).toFixed(2)
      : "-";
  };

  // Helper to convert letter grade to grade point
  const getGradePoint = (grade: string) => {
    const gradeMap: { [key: string]: number } = {
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      E: 0,
    };
    return gradeMap[grade] || 0;
  };

  // Calculate total credits completed
  const calculateTotalCreditsCompleted = () => {
    let totalCredits = 0;
    Object.keys(semesterCourses).forEach((semesterId) => {
      const courses =
        semesterCourses[semesterId as keyof typeof semesterCourses] || [];
      courses.forEach((course) => {
        if (course.grade) {
          totalCredits += course.credits;
        }
      });
    });
    return totalCredits;
  };

  const [selectedSemester, setSelectedSemester] = useState(semesters[0].id);

  // ==== Bagian untuk Fitur Unduh PDF ====
  const khsContentRef = useRef<HTMLDivElement>(null);
  // DIHAPUS: Ref untuk transkrip tidak diperlukan lagi
  // const transcriptContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadKHS = () => {
    const element = khsContentRef.current;
    if (element) {
      const semesterName = semesters
        .find((s) => s.id === selectedSemester)
        ?.name.replace(/[\/\\?%*:|"<>]/g, "_");

      const options = {
        margin: 0.5,
        filename: `KHS_${semesterName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(element).set(options).save();
    }
  };

  // DIHAPUS: Fungsi untuk unduh transkrip tidak diperlukan lagi
  // const handleDownloadTranscript = () => { ... };
  // ===========================================

  return (
    <div className="animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">
          Kartu Hasil Studi (KHS)
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Lihat hasil studi Anda per semester
        </p>
      </div>

      {/* Summary Cards */}
      {/* DIUBAH: Layout grid disesuaikan menjadi 3 kolom untuk layar besar */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow rounded-lg hover-scale">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total SKS Lulus
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {calculateTotalCreditsCompleted()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg hover-scale">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    IPK
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {calculateCumulativeGPA()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg hover-scale">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Predikat
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {Number(calculateCumulativeGPA()) >= 3.5
                        ? "CumLaude"
                        : Number(calculateCumulativeGPA()) >= 3.0
                        ? "Sangat Memuaskan"
                        : Number(calculateCumulativeGPA()) >= 2.5
                        ? "Memuaskan"
                        : "Cukup"}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        {/* DIHAPUS: Kartu untuk unduh transkrip */}
      </div>

      {/* Semester Details */}
      <div className="mt-6 bg-white shadow rounded-lg" ref={khsContentRef}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center">
          <label htmlFor="semester-select" className="mr-2 font-medium">
            Pilih Semester:
          </label>
          <select
            id="semester-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>
        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {semesters.find((s) => s.id === selectedSemester)?.name}
            </h3>
            <div className="text-right">
              <div className="text-sm text-gray-500">IP Semester:</div>
              <div className="text-xl font-bold text-kampus-primary">
                {calculateSemesterGPA(selectedSemester)}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                Hasil Studi{" "}
                {semesters.find((s) => s.id === selectedSemester)?.name}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead className="text-center">SKS</TableHead>
                  <TableHead className="text-center">Nilai</TableHead>
                  <TableHead className="text-center">Bobot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semesterCourses[
                  selectedSemester as keyof typeof semesterCourses
                ]?.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell className="text-center">
                      {course.credits}
                    </TableCell>
                    <TableCell className="text-center">
                      {course.grade || (
                        <span className="text-gray-400 italic">
                          Belum ada nilai
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {course.grade
                        ? (
                            getGradePoint(course.grade) * course.credits
                          ).toFixed(1)
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleDownloadKHS}
              disabled={
                semesters.find((s) => s.id === selectedSemester)?.active
              }
            >
              <Download className="h-4 w-4" />
              Unduh KHS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KHS;
