import { useMutation } from "@tanstack/react-query";
import { swapApi } from "@/lib/api/swap";
import type { SwapRequest, SwapResponse, SwapSubmitRequest, SwapSubmitResponse } from "@/types/swap";

export function useSwap() {
  const swapMutation = useMutation<SwapResponse, unknown, SwapRequest>({
    mutationFn: (data) => swapApi.swap(data).then(res => res.data),
  });

  const submitMutation = useMutation<SwapSubmitResponse, unknown, SwapSubmitRequest>({
    mutationFn: (data) => swapApi.submit(data).then(res => res.data),
  });

  return {
    swap: swapMutation.mutate,
    swapAsync: swapMutation.mutateAsync,
    swapStatus: swapMutation.status,
    swapData: swapMutation.data,
    swapError: swapMutation.error,
    submit: submitMutation.mutate,
    submitAsync: submitMutation.mutateAsync,
    submitStatus: submitMutation.status,
    submitData: submitMutation.data,
    submitError: submitMutation.error,
  };
}
