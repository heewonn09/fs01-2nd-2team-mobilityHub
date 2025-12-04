import {
  Car,
  Sun,
  Cloud,
  CloudRain,
  Droplet,
  Users,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MainSection() {
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 날씨 API로 오늘 날씨 데이터로 변경
  const weather = {
    condition: "비", // '맑음', '흐림', '비'
    // import "lucide-react"를 통해 날씨 아이콘 가져옴
    // 맑음: Sun, 비: CloudRain
    icon: CloudRain,
  };

  const isRainy = weather.condition === "비";

  // DB 데이터로 변경 필요
  const todayTrafficData = [
    { time: "06:00", entry: 2, exit: 0 },
    { time: "09:00", entry: 12, exit: 3 },
    { time: "12:00", entry: 8, exit: 7 },
    { time: "15:00", entry: 15, exit: 9 },
    { time: "18:00", entry: 5, exit: 18 },
    { time: "21:00", entry: 3, exit: 8 },
  ];

  const todayUsersByArea = [
    { area: "입출구", count: 45 },
    { area: "세차장", count: 18 },
    { area: "정비존", count: 9 },
    { area: "주차장", count: 27 },
  ];

  const parkedVehicles = [
    {
      id: "1",
      plateNumber: "12가3456",
      spotNumber: 1,
      entryTime: "13:45",
      duration: "1시간 30분",
    },
    {
      id: "2",
      plateNumber: "78나9012",
      spotNumber: 3,
      entryTime: "14:10",
      duration: "1시간 5분",
    },
    {
      id: "3",
      plateNumber: "34다5678",
      spotNumber: 2,
      entryTime: "14:50",
      duration: "25분",
    },
  ];

  const WeatherIcon = weather.icon;

  return (
    <div className="p-6 space-y-6 h-full">
      {/* 통계 차트 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 금일 집계 (시간대별 입출차) */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">금일 집계 (시간대별 입출차)</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={todayTrafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="entry"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="입차"
                />
                <Line
                  type="monotone"
                  dataKey="exit"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="출차"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 금일 이용회원 (구역별) */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">금일 이용회원 (구역별)</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={todayUsersByArea}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" name="이용 인원" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 현재 주차 차량 목록과 시스템 정보 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 현재 주차 차량 목록 */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">현재 주차장 차량 목록</h3>
              <span className="text-blue-600">
                총 {parkedVehicles.length}대 주차중
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">
                    차량번호
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    주차 위치
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    입차 시간
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    주차 시간
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parkedVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Car className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {vehicle.plateNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {vehicle.spotNumber}번 주차면
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{vehicle.entryTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{vehicle.duration}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 날짜, 날씨, 센서 시스템 통합 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* 날짜와 날씨 */}
          <div>
            <p className="text-gray-500 text-sm mb-2">오늘 날짜</p>
            <p className="text-gray-900 mb-4">{currentDate}</p>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <WeatherIcon className="w-10 h-10 text-yellow-500" />
              <span className="text-gray-700">{weather.condition}</span>
            </div>
          </div>

          {/* 물 수위 센서 시스템 */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-500 text-sm mb-3">물 수위 센서 시스템</p>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isRainy ? "bg-green-500 animate-pulse" : "bg-gray-300"
                  }`}
                ></div>
                <span
                  className={`${isRainy ? "text-green-600" : "text-gray-400"}`} // 날씨가 비라면 "초록색" 아니면 "회색"
                >
                  {/* 날씨가 비라면 "ON" 아니면 "OFF" */}
                  {isRainy ? "ON" : "OFF"}
                </span>
              </div>
              <Droplet
                className={`w-6 h-6 ${
                  isRainy ? "text-blue-600" : "text-gray-400"
                }`}
              />
            </div>
            {/* 날씨 === 비 */}
            {isRainy && (
              <p className="text-blue-600 text-sm mt-3">
                {/* 센서 on pub 필요 */}
                비가 내리고 있어 센서가 활성화되었습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
