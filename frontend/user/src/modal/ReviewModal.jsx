import React from "react";
import "../style/ReviewModal.css";

export function ReviewModal({ visible, onClose, reviewData, onChange, onSave }) {
  // 모달 안 보이면 아무것도 렌더링하지 않음
  if (!visible) return null;

  return (
    <div className="review-overlay">
      <div className="review-modal">
        <div className="review-header">
          <h3>후기 남기기</h3>
          <button onClick={onClose}>X</button>
        </div>

        <div className="review-insert">
          <textarea
            style={{ height: "36px" }}
            name="title"
            value={reviewData.title}
            onChange={onChange}
            placeholder="제목을 입력해주세요"
          />
          <textarea
            name="content"
            value={reviewData.content}
            onChange={onChange}
            placeholder="후기를 입력해주세요"
          />

          <div className="btn">
            <button onClick={onClose}>취소</button>
            <button onClick={onSave}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
