import { useState } from "react";

// API
import { createStock } from "../../api/repairAPI";

// 재고추가 모달
export default function StockCreateModal({ onClose, refreshStockList }) {
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    inventoryId: "",
    productName: "",
    stockCategory: "",
    stockQuantity: "",
    minStockQuantity: "",
    stockPrice: "EA",
    stockUnits: "",
  });

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 업데이트
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 재고 추가 핸들러
  const handleCreate = async (e) => {
    e.preventDefault();

    // 빈 칸 확인
    const isEmptyField = Object.values(formData).some(
      (value) => value === "" || value === null || value == undefined
    );

    if (isEmptyField) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 요청 본문 구성
    const requestBody = {
      inventoryId: formData.inventoryId,
      productName: formData.productName,
      stockCategory: formData.stockCategory,
      stockQuantity: Number(formData.stockQuantity),
      minStockQuantity: Number(formData.minStockQuantity),
      stockPrice: Number(formData.stockPrice),
      stockUnits: formData.stockUnits,
    };

    // 재고 추가 API 호출
    try {
      const response = await createStock(requestBody);

      if (response.status === 200) {
        alert("재고가 추가되었습니다.");

        await refreshStockList();
        onClose();
      }
    } catch (error) {
      console.error("재고 추가 실패:", error);
      alert("재고 추가 실패");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="stock-modal-content">
        {/* 헤더 */}
        <div className="stock-modal-header">
          <h2 className="stock-header-h2">부품추가</h2>
          <button className="stock-close-button" onClick={onClose}>
            X
          </button>
        </div>

        {/* 내용 */}
        <div className="stock-modal-body">
          {/* 아이디 */}
          <div>
            <label className="stock-label">재고 ID</label>
            <input
              type="text"
              name="inventoryId"
              value={formData.inventoryId}
              onChange={handleChange}
              placeholder="예: A01"
              className="input-inventory-value"
            />
          </div>

          {/* 부품명 */}
          <div>
            <label className="stock-label">부품명</label>
            <input
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="input-inventory-value"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="stock-label">카테고리</label>
            <input
              name="stockCategory"
              value={formData.stockCategory}
              onChange={handleChange}
              className="input-inventory-value"
            />
          </div>

          {/* 가격 */}
          <div>
            <label className="stock-label">개당 가격</label>
            <input
              type="number"
              name="stockPrice"
              value={formData.stockPrice}
              onChange={handleChange}
              className="input-inventory-value"
            />
          </div>

          <div className="stock-input-box">
            {/* 단위 */}
            <div>
              <div className="div-inventory-units">
                <select
                  name="stockUnits"
                  value={formData.stockUnits}
                  onChange={handleChange}
                  className="input-inventory-quantity"
                >
                  <option value="EA">EA (개)</option>
                  <option value="L">L (리터)</option>
                </select>
              </div>

              {/* 초기 수량 */}
              <div>
                <label className="create-inventory-quantity">초기 수량</label>
                <div>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    className="input-inventory-quantity"
                  />
                </div>
              </div>

              {/* 최소 재고 */}
              <div>
                <label className="create-inventory-quantity">최소 재고</label>
                <div>
                  <input
                    type="number"
                    name="minStockQuantity"
                    value={formData.minStockQuantity}
                    onChange={handleChange}
                    className="input-inventory-quantity"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="modal-actions">
            <button onClick={onClose} className="cancle-modal-btn">
              취소
            </button>
            <button onClick={handleCreate} className="save-modal-btn">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
