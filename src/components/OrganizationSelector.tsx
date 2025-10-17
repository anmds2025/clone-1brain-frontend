import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useOrganizationList } from '@clerk/clerk-react';

export function OrganizationSelector() {
  const { userMemberships, setActive, isLoaded } = useOrganizationList();

  useEffect(() => {
    const selectFirstOrganization = async () => {
      if (isLoaded && userMemberships?.data && userMemberships.data.length > 0) {
        const firstOrg = userMemberships.data[0];
        try {
          await setActive({ organization: firstOrg.organization.id });
        } catch (error) {
          console.error('Error selecting organization:', error);
        }
      }
    };

    selectFirstOrganization();
  }, [isLoaded, userMemberships, setActive]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Setting up organization...</p>
        </div>
      </div>
    );
  }
  
  return <Navigate to="/" replace />;
}
