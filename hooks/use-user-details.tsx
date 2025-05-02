import { useAtom } from "jotai"
import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"
import { userDetailsAtom, beneficiariesAtom, tokensAtom } from "@/lib/store/auth"
import { tokenAtom } from "@/lib/store/auth"

export function useUserDetails() {
  const [userDetails] = useAtom(userDetailsAtom)
  const [beneficiaries] = useAtom(beneficiariesAtom)
  const [tokens] = useAtom(tokensAtom)
  const [token] = useAtom(tokenAtom)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userDetails"],
    queryFn: authApi.getUserDetails,
    enabled: !!token,
  })

  return {
    userDetails,
    beneficiaries,
    tokens,
    isLoading,
    error,
    refetch,
    rawData: data,
  }
}
