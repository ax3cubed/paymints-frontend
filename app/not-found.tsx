"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  // Only access localStorage after component is mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
        </div>
        <Button asChild>
          <Link href="/" className="inline-flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
