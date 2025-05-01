"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { cva } from "class-variance-authority"

// Define loading spinner variants
const spinnerVariants = cva("animate-spin rounded-full border-4 border-t-transparent", {
  variants: {
    type: {
      default: "border-primary h-8 w-8",
      electric: "border-secondary h-10 w-10",
      bolt: "border-accent h-6 w-6",
    },
  },
  defaultVariants: {
    type: "default",
  },
})

type LoadingType = "default" | "electric" | "bolt"

interface LoadingContextType {
  isLoading: boolean
  loadingType: LoadingType
  loadingMessage: string
  startLoading: (type?: LoadingType, message?: string) => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  loadingType: "default",
  loadingMessage: "",
  startLoading: () => {},
  stopLoading: () => {},
})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<LoadingType>("default")
  const [loadingMessage, setLoadingMessage] = useState("")

  const startLoading = (type: LoadingType = "default", message = "Loading...") => {
    setIsLoading(true)
    setLoadingType(type)
    setLoadingMessage(message)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setLoadingMessage("")
  }

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingType,
        loadingMessage,
        startLoading,
        stopLoading,
      }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card text-card-foreground rounded-lg p-6 max-w-sm w-full shadow-xl animate-scale-in">
            <div className="flex items-center space-x-4">
              <div className={spinnerVariants({ type: loadingType })}></div>
              <div>
                <p className="font-medium text-foreground">{loadingMessage}</p>
                <p className="text-sm text-muted-foreground">Please wait while we process your request</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export const useLoadingContext = () => useContext(LoadingContext)
