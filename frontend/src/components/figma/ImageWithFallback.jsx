import React, { useState } from "react";

// 이미지 로딩 실패 시 보여줄 기본 이미지 (base64 SVG)
const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false); // 로딩 실패 여부

  // 이미지 로딩 실패 시 호출
  const handleError = () => {
    setDidError(true);
  };

  // props 분해
  const { src, alt, style, className, ...rest } = props;

  // 실패했으면 fallback, 아니면 원본 이미지
  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${
        className ?? ""
      }`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={ERROR_IMG_SRC} // 기본 이미지
          alt="Error loading image"
          {...rest}
          data-original-url={src} // 원본 URL 기록
        />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError} // 실패하면 handleError 호출
    />
  );
}
