import React from "react";
import backendServer from "./backendServer";
import request from "./requests";

const repairPageAllList = async () => {
  try {
    const response = await backendServer.get(request.repairAll);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return [];
  }
};

const reportAllList = async () => {
  try {
    const response = await backendServer.get(request.reportList);

    return response.data;
  } catch (error) {
    console.error("보고서 리스트 호출도중 에러발생: ", error);
    return [];
  }
};

const createStock = async (stockData) => {
  try {
    const response = await backendServer.post(request.createStock, stockData);

    return response;
  } catch (error) {
    console.error("에러발생: ", error);
    alert("재고추가 도중 에러가 발생했습니다.");
  }
};

const updateStock = async (updateStockData) => {
  try {
    const response = await backendServer.post(
      request.updateStock,
      updateStockData
    );
    return response;
  } catch (error) {
    console.error("에러발생: ", error);
    alert("재고수정 도중 에러가 발생했습니다.");
  }
};

const deleteStock = async (inventoryId) => {
  try {
    const response = await backendServer.delete(request.deleteStock, {
      params: { inventoryId },
    });
    return response;
  } catch (error) {
    console.error("에러발생: ", error);
    alert("재고삭제 도중 에러가 발생했습니다.");
  }
};

export {
  repairPageAllList,
  reportAllList,
  updateStock,
  deleteStock,
  createStock,
};
