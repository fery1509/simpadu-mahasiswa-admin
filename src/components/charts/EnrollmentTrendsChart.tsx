import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Mock data for enrollment trends
const enrollmentData = [
  {
    year: "2021",
    "Teknik Sipil": 120,
    "Teknik Mesin": 150,
    "Teknik Elektro": 180,
    "Akuntansi": 200,
    "Administrasi Bisnis": 160,
  },
  {
    year: "2022",
    "Teknik Sipil": 140,
    "Teknik Mesin": 160,
    "Teknik Elektro": 190,
    "Akuntansi": 220,
    "Administrasi Bisnis": 180,
  },
  {
    year: "2023",
    "Teknik Sipil": 160,
    "Teknik Mesin": 170,
    "Teknik Elektro": 210,
    "Akuntansi": 240,
    "Administrasi Bisnis": 200,
  },
  {
    year: "2024",
    "Teknik Sipil": 180,
    "Teknik Mesin": 190,
    "Teknik Elektro": 230,
    "Akuntansi": 260,
    "Administrasi Bisnis": 220,
  },
  {
    year: "2025",
    "Teknik Sipil": 200,
    "Teknik Mesin": 210,
    "Teknik Elektro": 250,
    "Akuntansi": 280,
    "Administrasi Bisnis": 240,
  },
];

const COLORS = {
  "Teknik Sipil": "#F5F5DC", // Cream
  "Teknik Mesin": "#000080", // Navy Blue
  "Teknik Elektro": "#FF0000", // Red
  "Akuntansi": "#FFD700", // Yellow
  "Administrasi Bisnis": "#008000", // Green
};

const YEARS = ["2021", "2022", "2023", "2024", "2025"];

const EnrollmentTrendsChart = () => {
  const [selectedYear, setSelectedYear] = useState("2021");

  const selectedData = enrollmentData.find((data) => data.year === selectedYear);

  const chartData = selectedData
    ? Object.entries(selectedData)
        .filter(([key]) => key !== "year")
        .map(([department, value]) => ({
          department,
          value,
          fill: COLORS[department as keyof typeof COLORS],
        }))
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-gray-600">
            Jumlah Mahasiswa: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Data Grafik Penerimaan Mahasiswa per Jurusan
        </CardTitle>
        <div className="flex gap-2 mt-4">
          {YEARS.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              onClick={() => setSelectedYear(year)}
              className={`${
                selectedYear === year
                  ? "bg-[#000e7c] text-white hover:bg-[#000e7c]/90"
                  : "hover:bg-gray-100"
              } transition-all duration-200`}
            >
              {year}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full flex">
          <div className="w-[650px] max-w-full ml-0">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barGap={0}
                barCategoryGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="department" 
                  tick={{ fill: '#4B5563' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis 
                  tick={{ fill: '#4B5563' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  barSize={80}
                  name="Jumlah Mahasiswa"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={entry.department} 
                      fill={entry.fill} 
                      stroke="#222" 
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Keterangan jurusan */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
          {Object.entries(COLORS).map(([jurusan, color]) => (
            <div key={jurusan} className="flex items-center min-w-[120px]">
              <span
                className="inline-block w-4 h-4 rounded mr-2"
                style={{ backgroundColor: color }}
              />
              <span
                className="text-sm text-gray-700"
                style={{ fontStyle: jurusan.length > 18 ? 'italic' : 'normal' }}
              >
                {jurusan}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollmentTrendsChart; 