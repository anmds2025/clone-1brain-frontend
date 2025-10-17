import { useState, useEffect, useMemo } from 'react';
import { useOrganization, useOrganizationList, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Building2, Users, Mail, Crown, User, Trash2, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { OrganizationMembershipResource } from '@clerk/types';
import OrganizationInfoForm from './OrganizationInfoForm';
import MembersSection from './MembersSection';

export default function OrganizationManagementPage() {
  const { organization } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: orgLoaded } = useOrganizationList();
  const [isUpdating, setIsUpdating] = useState(false);
  const [orgName, setOrgName] = useState('');

  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]);
  const isAdmin = useMemo(() => {
    if (!userLoaded || !orgLoaded || !user) return false;
    const memberships = user.organizationMemberships ?? [];
    return memberships.some(
      (m) => m.role === 'admin' || m.role === 'org:admin'
    );
  }, [user, userLoaded, orgLoaded]);


  const fetchMembers = async () => {
      try {
        const membershipList = await organization.getMemberships();
        setMembers(membershipList.data);
      } catch (err) {
        console.error(err);
      }
  };

  const handleUpdateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;
    
    setIsUpdating(true);
    try {
      await organization.update({ name: orgName });
      toast.success('Organization updated successfully');
    } catch (error) {
      toast.error('Failed to update organization');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (organization) {
      setOrgName(organization.name);
      fetchMembers()
    }
  }, [organization]);

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Organization Selected</h2>
          <p className="text-muted-foreground">Please select an organization to manage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Management</h1>
          <p className="text-muted-foreground">Manage your organization settings and members</p>
        </div>
        <Badge variant={isAdmin ? "default" : "secondary"}>
          {isAdmin ? "Admin" : "Member"}
        </Badge>
      </div>

      <OrganizationInfoForm
        orgName={orgName}
        setOrgName={setOrgName}
        isAdmin={isAdmin}
        isUpdating={isUpdating}
        onSubmit={handleUpdateOrganization}
      />

      <MembersSection
        organization={organization}
        members={members}
        userId={user?.id}
        isAdmin={isAdmin}
        fetchMembers={fetchMembers}
      />
    </div>
  );
}
