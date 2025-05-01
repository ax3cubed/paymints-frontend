import apiClient from "@/lib/api/client"
import type { AuthResponse, UserDetailsResponse } from "@/lib/api/types"

export const authApi = {
  connectUser: async (address: string) => {
    const response = await apiClient.post<AuthResponse>("/api/auth/connectuser", { address })
    return response.data
  },

  register: async (address: string) => {
    const response = await apiClient.post<AuthResponse>("/api/auth/register", { address })
    return response.data
  },

  login: async (addressOrUsername: string) => {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", { addressOrUsername })
    return response.data
  },

  getUserDetails: async () => {
    const response = await apiClient.get<UserDetailsResponse>("/api/auth/me")
    return response.data
  },
}
