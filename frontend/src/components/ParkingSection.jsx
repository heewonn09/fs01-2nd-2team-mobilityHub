import { CCTVFeed } from "./CCTVFeed";

import { Car, CheckCircle, XCircle } from "lucide-react";

// 주차장 샘플 이미지 URL --> 카메라
const PARKING_IMAGE =
  "https://images.unsplash.com/photo-1653750366046-289780bd8125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwc2VjdXJpdHklMjBjYW1lcmF8ZW58MXx8fHwxNzY0Mjg5NzM0fDA&ixlib=rb-4.1.0&q=80&w=1080";

export function ParkingSection() {
  // 주차 구역 데이터 -> DB
  const parkingSpots = [
    {
      id: "1",
      spotNumber: 1,
      status: "사용중",
      plateNumber: "12가3456",
      parkedSince: "13:45",
    },
    {
      id: "2",
      spotNumber: 2,
      status: "사용가능",
    },
    {
      id: "3",
      spotNumber: 3,
      status: "사용중",
      plateNumber: "78나9012",
      parkedSince: "14:10",
    },
  ];

  // 전체 주차 공간 수
  const totalSpots = parkingSpots.length;

  // 사용중인 주차 공간 수
  const occupiedSpots = parkingSpots.filter(
    (spot) => spot.status === "사용중"
  ).length;

  // 비어 있는 주차 공간 수
  const availableSpots = totalSpots - occupiedSpots;

  // 점유율(%) 계산
  const occupancyRate = Math.round((occupiedSpots / totalSpots) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* -----------------------------------
          상단 통계 카드 영역
         ----------------------------------- */}
      <div className="grid grid-cols-4 gap-6">
        {/* 전체 주차면 카드 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">전체 주차면</p>
              <p className="text-gray-900 mt-2">{totalSpots}면</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* 사용중 카드 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">사용중</p>
              <p className="text-gray-900 mt-2">{occupiedSpots}면</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* 사용가능 카드 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">사용가능</p>
              <p className="text-gray-900 mt-2">{availableSpots}면</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* 점유율 카드 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">점유율</p>
              <p className="text-gray-900 mt-2">{occupancyRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------
          CCTV 피드 영역
         ----------------------------------- */}
      <div className="grid grid-cols-3 gap-6">
        {/* CCTV A */}
        <CCTVFeed
          cameraId="CAM-PARK-A"
          title="주차장 구역 A"
          imageUrl={PARKING_IMAGE}
        />

        {/* CCTV B */}
        <CCTVFeed
          cameraId="CAM-PARK-B"
          title="주차장 구역 B"
          imageUrl={PARKING_IMAGE}
        />

        {/* CCTV C */}
        <CCTVFeed
          cameraId="CAM-PARK-C"
          title="주차장 구역 C"
          imageUrl={PARKING_IMAGE}
        />
      </div>

      {/* -----------------------------------
          주차 공간 상세 정보 영역
         ----------------------------------- */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">주차 공간 현황</h3>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* 주차 구역 반복 출력 */}
            {parkingSpots.map((spot) => (
              <div
                key={spot.id}
                className={`p-6 rounded-lg border-2 ${
                  spot.status === "사용가능"
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                {/* 상단: 주차면 번호 + 상태 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Car
                      className={`w-6 h-6 ${
                        spot.status === "사용가능"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                    <span
                      className={`${
                        spot.status === "사용가능"
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      {spot.spotNumber}번 주차면
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      spot.status === "사용가능"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {spot.status}
                  </span>
                </div>

                {/* 사용중인 경우: 차량번호 / 주차 시간 */}
                {spot.status === "사용중" && (
                  <div className="space-y-2">
                    {/* 차량번호 */}
                    <div className="flex justify-between">
                      <span
                        className={`text-sm ${
                          spot.status === "사용가능"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        차량번호
                      </span>
                      <span
                        className={`${
                          spot.status === "사용가능"
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        {spot.plateNumber}
                      </span>
                    </div>

                    {/* 주차 시작 시간 */}
                    <div className="flex justify-between">
                      <span
                        className={`text-sm ${
                          spot.status === "사용가능"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        주차 시작
                      </span>
                      <span
                        className={`${
                          spot.status === "사용가능"
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        {spot.parkedSince}
                      </span>
                    </div>
                  </div>
                )}

                {/* 사용가능한 경우: "주차 가능" 표시 */}
                {spot.status === "사용가능" && (
                  <p
                    className={`text-center ${
                      spot.status === "사용가능"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    주차 가능
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
