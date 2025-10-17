import { Navigate } from "react-router-dom";
import { useUser, useOrganizationList } from "@clerk/clerk-react";
import { useMemo } from "react";

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: orgLoaded } = useOrganizationList();

  const isAdmin = useMemo(() => {
    if (!userLoaded || !orgLoaded || !user) return false;
    const memberships = user.organizationMemberships ?? [];
    return memberships.some(
      (m) => m.role === "admin" || m.role === "org:admin"
    );
  }, [user, userLoaded, orgLoaded]);

  if (!userLoaded || !orgLoaded) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/connectors" replace />;
  }

  return children;
};
