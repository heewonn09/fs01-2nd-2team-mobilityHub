import { Video } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";

// 이미지 url이 아니라 라즈베리파이 카메라 연동 필요

export function CCTVFeed({ cameraId, title, imageUrl }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1초마다 타임 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(timer);
  }, []);

  // 화면에 표시할 시간 문자열
  const timeString = currentTime.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {/* 영상 영역 비율을 유지하도록 aspect-video 사용 */}
      <div className="relative aspect-video">
        {/* 이미지가 있으면 표시하고, 없으면 Video 아이콘 출력 */}
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={`CCTV - ${title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <Video className="w-16 h-16 text-gray-600" />
          </div>
        )}

        {/* LIVE 표시 배지 */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-white text-sm">LIVE</span>
        </div>

        {/* 현재 시간 표시 */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 px-3 py-1 rounded">
          <span className="text-white text-sm">{timeString}</span>
        </div>

        {/* 녹화 중 아이콘 표시 */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 p-2 rounded-full">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 카메라 제목 및 ID */}
      <div className="p-3 bg-gray-800">
        <p className="text-white text-sm">{title}</p>
        <p className="text-gray-400 text-xs mt-1">Camera ID: {cameraId}</p>
      </div>
    </div>
  );
}
