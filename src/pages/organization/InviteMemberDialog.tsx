import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useOrganization } from '@clerk/clerk-react';
import { useInviteMember } from '@/hooks/useMember';

export default function InviteMemberDialog({ open, onOpenChange, onSuccess }) {
  const { organization } = useOrganization();
  const { inviteMember } = useInviteMember()
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    if (!organization?.id) {
      toast.error('Organization not found');
      return;
    }
    setIsInviting(true);
    try {
      await inviteMember({
        email: inviteEmail,
        organization_id: organization.id,
        role: 'org:member',
      });
      setInviteEmail('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Send an invitation to join your organization</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInviteMember}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@example.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isInviting}>
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
