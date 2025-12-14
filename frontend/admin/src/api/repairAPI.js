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

export { repairPageAllList, reportAllList };
