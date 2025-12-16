import React from "react";
import backendServer from "./backendServer";
import request from "./requests";

// 재고&차량내용 전체리스트
export const repairPageAllList = async () => {
  try {
    const response = await backendServer.get(request.repairAll);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return [];
  }
};

// 보고서 리스트
export const reportAllList = async () => {
  try {
    const response = await backendServer.get(request.reportList);

    return response.data;
  } catch (error) {
    console.error("보고서 리스트 호출도중 에러발생: ", error);
    return [];
  }
};

// 재고
export const createStock = async (stockData) => {
  try {
    const response = await backendServer.post(request.createStock, stockData);

    return response;
  } catch (error) {
    console.error("에러발생: ", error);
    alert("재고추가 도중 에러가 발생했습니다.");
  }
};

// 재고 내용 변경
export const updateStock = async (updateStockData) => {
  try {
    const response = await backendServer.post(request.updateStock, updateStockData);
    return response;
  } catch (error) {
    console.error("에러발생: ", error);
    alert("재고수정 도중 에러가 발생했습니다.");
  }
};

// 재고 삭제
export const deleteStock = async (inventoryId) => {
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

// 보고서 작성
export const writeReport = async (reportData) => {
  try {
    const response = await backendServer.post(request.writeReport, reportData);

    return response;
  } catch (error) {
    console.error("에러발생: ", error);
    alert("보고서 작성도중 에러가 발생했습니다.");
  }
};

// 작업완료 rc카에 보내기
export const sendComplete = async (workInfoId) => {
  try {
    const response = await backendServer.post(request.sendRepairComplete, null, {
      params: { workInfoId },
    });

    return response;
  } catch (error) {
    console.error("작업완료 에러발생: ", error);
    alert("작업완료 전송 중 에러가 발생했습니다.");
  }
};

// 월별 금액
export const getRepairAmount = async () => {
  try {
    const response = await backendServer.get(`${request.repairAmount}`);
    return response;
  } catch (error) {
    console.error("월별금액을 조회 중 에러가 발생: ", error);
  }
};

// 관리자 리스트
export const getAdminList = async () => {
  try {
    const respone = await backendServer.get(request.adminList);

    return respone.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return null;
  }
};
