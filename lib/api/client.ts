import axios from "axios"
import { config } from "@/lib/config"

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

export default apiClient