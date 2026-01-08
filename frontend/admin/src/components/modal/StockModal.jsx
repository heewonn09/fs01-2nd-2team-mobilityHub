import { useState } from "react";

// API
import { deleteStock, updateStock } from "../../api/repairAPI";

// 재고 수정/삭제 모달
export default function StockModal({ onClose, data, refreshStockList }) {
  const [modalData, setModalData] = useState({ ...data }); // 모달 데이터 상태

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 업데이트
    setModalData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  // 수정
  const handleUpdate = async (e) => {
    e.preventDefault();

    // 요청 본문 구성
    const requestBody = {
      inventoryId: modalData.inventoryId,
      productName: modalData.productName,
      stockCategory: modalData.stockCategory,
      stockQuantity: Number(modalData.stockQuantity),
      stockPrice: Number(modalData.stockPrice),
    };

    // 재고 수정 API 호출
    try {
      const response = await updateStock(requestBody);

      if (response.status === 200) {
        alert("수정 완료");

        await refreshStockList();
        onClose();
      }
    } catch (error) {
      console.error("수정실패:", error);
      alert("수정실패");
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    // 재고 삭제 API 호출
    try {
      const response = await deleteStock(modalData.inventoryId);

      if (response.status === 200) {
        alert("삭제 완료");

        await refreshStockList();
        onClose();
      }
    } catch (error) {
      console.error("삭제실패:", error);
      alert("삭제실패");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="stock-modal-content">
        {/* 헤더 */}
        <div className="stock-modal-header">
          <h2 name="inventoryId" value={modalData.inventoryId} className="stock-header-h2">
            부품 상세 정보
          </h2>
          <button className="stock-close-button" onClick={onClose}>
            X
          </button>
        </div>

        {/* 내용 */}
        <div className="stock-modal-body">
          {/* 부품명 */}
          <div>
            <label className="stock-label">부품명</label>
            <input
              name="productName"
              value={modalData.productName}
              onChange={handleChange}
              className="input-inventory-value"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="stock-label">카테고리</label>
            <input
              name="stockCategory"
              value={modalData.stockCategory}
              onChange={handleChange}
              className="input-inventory-value"
            />
          </div>

          {/* 현재 재고 */}
          <div>
            <label className="stock-label">현재 재고</label>
            <input
              name="stockQuantity"
              type="number"
              value={modalData.stockQuantity}
              onChange={handleChange}
              className="input-inventory-value"
            />
          </div>

          {/* 가격 */}
          <div>
            <label className="stock-label">가격</label>
            <input
              name="stockPrice"
              type="number"
              value={modalData.stockPrice}
              onChange={handleChange}
              className="input-inventory-value"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleDelete} className="delete-modal-btn">
            삭제
          </button>
          <button onClick={onClose} className="cancle-modal-btn">
            취소
          </button>
          <button onClick={handleUpdate} className="save-modal-btn">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
