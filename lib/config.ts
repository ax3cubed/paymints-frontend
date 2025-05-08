/**
 * Application configuration
 */
export const config = {
    /**
     * API configuration
     */
    api: {
      /**
       * Base URL for API requests
       */
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  
      /**
       * Whether to use mock data instead of real API
       * Set to 'true' to use mock data, 'false' to use real API
       */
      useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true",
  
      /**
       * Mock data delay in milliseconds (only used when useMockData is true)
       */
      mockDataDelay: 1000,
    },
  }
  