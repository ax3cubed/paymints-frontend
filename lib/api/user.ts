import apiClient from "./client"

export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get("/api/user/profile")
    return response.data
  },

  updateProfile: async (profileData: {
    fullName?: string
    phoneNumber?: string
    address?: string
    profileImage?: string
  }) => {
    const response = await apiClient.put("/api/user/profile", profileData)
    return response.data
  },

  addBeneficiary: async (beneficiaryData: {
    name: string
    email: string
    walletAddress: string
  }) => {
    const response = await apiClient.post("/api/user/add/beneficiary", beneficiaryData)
    return response.data
  },
}
