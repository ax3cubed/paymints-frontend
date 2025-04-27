"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, isLoadingAtom } from "@/lib/atoms";

const publicRoutes = ["/", "/about", "/contact"];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (publicRoutes.includes(pathname)) {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!publicRoutes.includes(pathname) && !isAuthenticated && !isLoading) {
    return null;
  }

  return <>{children}</>;
}
