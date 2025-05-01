import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { useLoadingContext } from '@/providers/loading-provider';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredAuth?: boolean; // true = require authentication, false = require no authentication
  adminOnly?: boolean;     // true = only allow admins
  redirectTo?: string;    // where to redirect if requirements not met
}

export function AuthGuard({
  children,
  requiredAuth = true,
  adminOnly = false,
  redirectTo,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingContext();

  useEffect(() => {
    if (isLoading) {
      startLoading("default", "Checking authentication...");
      return;
    } else {
      stopLoading();
    }

    if (requiredAuth && !isAuthenticated) {
      router.push(redirectTo || '/');
      return;
    }

    if (!requiredAuth && isAuthenticated) {
      router.push(redirectTo || '/dashboard');
      return;
    }

    if (adminOnly && (!user || !user.isAdmin)) {
      router.push(redirectTo || '/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredAuth, adminOnly, redirectTo, router]);

  if (isLoading) return <div>Loading...</div>;

  if (requiredAuth && !isAuthenticated) return null;
  if (!requiredAuth && isAuthenticated) return null;
  if (adminOnly && (!user || !user.isAdmin)) return null;

  return <>{children}</>;
}
