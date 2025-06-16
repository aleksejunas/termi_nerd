
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Skeleton } from '@/components/ui/skeleton';

const AdminRouteGuard: React.FC = () => {
  const { data: isAdmin, isLoading, isError } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRouteGuard;
