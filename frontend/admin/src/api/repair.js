import React from "react";
import backendServer from "./backendServer";
import request from "./requests";

export const getRepair = async () => {
  try {
    const response = await backendServer.get(`${request.repairAll}`);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return [];
  }
};
