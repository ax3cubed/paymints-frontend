import { SwapRequest, SwapResponse, SwapSubmitRequest, SwapSubmitResponse } from "@/types/swap";
import apiClient from "./client";


export const swapApi = {
  swap: (data: SwapRequest) =>
    apiClient.post<SwapResponse>("/swap/", data),

  submit: (data: SwapSubmitRequest) =>
    apiClient.post<SwapSubmitResponse>("/swap/submit", data),
};