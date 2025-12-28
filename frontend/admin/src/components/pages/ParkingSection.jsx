import React, { useEffect, useState } from "react";
import { Car, CheckCircle, XCircle } from "lucide-react";

import "../style/ParkingSection.css"; // CSS 분리
import "../../App.css";
import { workInfoTotalList } from "../../api/workInfoAPI";
import useMqtt from "../hook/useMqtt";

const BROKER_URL = "ws://192.168.137.1:9001";
export default function ParkingSection() {
  const [workTotalList, setWorkTotalList] = useState([]);
  const { connectStatus, imageSrc, publish } = useMqtt(BROKER_URL);

  useEffect(() => {
    workInfoTotalList()
      .then((res) => {
        setWorkTotalList(res);
      })
      .catch((err) => console.error("조회실패: ", err));
  }, []);

  useEffect(() => {
    if (connectStatus === "connected") {
      publish("parking/web/parkingzone/cam", "start");
    }
  }, [connectStatus, publish]);

  console.log(workTotalList);

  const sectors = ["P01", "P02", "P03"];
  const carStateToSector = {
    5: "P01",
    7: "P02",
    9: "P03",
  };

  // 출차시간이 없으면 carstate값이 5, 7, 9(주차장 칸 번호)가 있는 차량 수
  const activeVehicles = workTotalList.filter(
    (v) => !v.exit_time && [5, 7, 9].includes(Number(v.carState))
  );

  // 갯수 확인
  const countParking = activeVehicles.length;

  console.log(countParking);

  // 화면용 parkingSpots 생성
  const parkingSpots = sectors.map((sector) => {
    // 이 구역에 맞는 차량 찾기
    const vehicle = activeVehicles.find((v) => carStateToSector[Number(v.carState)] === sector);

    return {
      id: sector,
      spotNumber: sector,
      status: vehicle ? "사용중" : "사용가능",
      plateNumber: vehicle ? vehicle.carNumber : null,
      parkedSince: vehicle ? vehicle.entry_time : null,
    };
  });

  return (
    <div className="page">
      {/* 통계 카드 */}
      <div className="status-card">
        {/* <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">전체 주차면</p>
              <p className="count">{sectors.length}</p>
            </div>
            <div className="stat-icon bg-gray">
              <Car />
            </div>
          </div>
        </div> */}

        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">사용중</p>
              <p className="stat-value text-red">{countParking} 대</p>
            </div>
            <div className="stat-icon bg-red">
              <XCircle />
            </div>
          </div>
        </div>

        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">사용가능</p>
              <p className="stat-value text-green">{sectors.length - countParking} 면</p>
            </div>
            <div className="stat-icon bg-green">
              <CheckCircle />
            </div>
          </div>
        </div>

        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">점유율</p>
              <p className="stat-value text-blue">
                {Math.round((countParking / sectors.length) * 100)} %
              </p>
            </div>
            <div className="stat-icon bg-blue">
              <Car />
            </div>
          </div>
        </div>
      </div>

      {/* CCTV + 주차 공간 */}
      <div className="main-grid">
        {/* CCTV 화면 */}
        <div className="cctv-container">
          {imageSrc ? (
            <img src={imageSrc} alt="camera" />
          ) : (
            <div className="cctv-placeholder">No Camera</div>
          )}
        </div>

        {/* 주차 공간 리스트 */}
        <div className="p-4 space-y-3">
          {parkingSpots.map((spot) => (
            <div
              key={spot.id}
              className={`p-4 rounded-lg border-2 ${
                spot.status === "사용가능"
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Car
                    className={`w-5 h-5 ${
                      spot.status === "사용가능" ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span
                    className={`${spot.status === "사용가능" ? "text-green-900" : "text-red-900"}`}
                  >
                    {spot.spotNumber}번 주차면
                  </span>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    spot.status === "사용가능"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {spot.status}
                </span>
              </div>

              {spot.status === "사용중" && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">차량번호</span>
                    <span className="text-red-900">{spot.plateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">주차 시작</span>
                    <span className="text-red-900">{spot.parkedSince}</span>
                  </div>
                </div>
              )}

              {spot.status === "사용가능" && (
                <p className="text-center text-green-700 text-sm">주차 가능</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
