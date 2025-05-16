import apiClient from "@/lib/api/client"
import { UserDetailsResponse } from "@/types"
import { AuthResponse } from "@/types/auth"

export const authApi = {
  connectUser: async (address: string) =>  await apiClient.post<AuthResponse>("/api/auth/connectuser", { address }),

  register: async (address: string) =>   await apiClient.post<AuthResponse>("/api/auth/register", { address }),

  login: async (addressOrUsername: string) =>  await apiClient.post<AuthResponse>("/api/auth/login", { addressOrUsername }),

  getUserDetails: async () => await apiClient.get<UserDetailsResponse>("/api/auth/me"),
}
