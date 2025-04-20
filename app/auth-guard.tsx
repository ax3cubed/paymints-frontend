"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAtom } from "jotai"
import { isAuthenticatedAtom, isLoadingAtom } from "@/lib/atoms"

// List of public routes that don't require authentication
const publicRoutes = ["/", "/about", "/contact"]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const [isLoading] = useAtom(isLoadingAtom)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for public routes
    if (publicRoutes.includes(pathname)) {
      return
    }

    // If auth is loaded and user is not authenticated, redirect to home page
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Show loading state while checking authentication
  if (isLoading && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // If on a protected route and not authenticated, don't render children
  if (!publicRoutes.includes(pathname) && !isAuthenticated && !isLoading) {
    return null
  }

  // Otherwise, render children
  return <>{children}</>
}
