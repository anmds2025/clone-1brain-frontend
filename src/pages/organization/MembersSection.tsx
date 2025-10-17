import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InviteMemberDialog from './InviteMemberDialog';
import MemberItem from './MemberItem';
import { useState } from 'react';
import { toast } from 'sonner';
import { useInviteMember } from '@/hooks/useMember';

export default function MembersSection({ organization, members, userId, isAdmin, fetchMembers }) {
  const [isOpenInviteDialog, setIsOpenInviteDialog] = useState(false);
  const { removeMember } = useInviteMember()
  const [isInviting, setIsInviting] = useState(false);

  const handleRemoveMember = async (memberId: string) => {
    if (!memberId) {
      toast.error("Member ID is required");
      return;
    }

    setIsInviting(true); // hoặc tạo state riêng như setIsRemoving
    try {
      await removeMember({
        user_id: memberId
      });

      toast.success("Member removed successfully");
      fetchMembers(); // refresh danh sách nếu cần
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to remove member");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members ({organization.membersCount || 0})
          </div>
          {isAdmin && (
            <Button onClick={() => setIsOpenInviteDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              currentUserId={userId}
              isAdmin={isAdmin}
              onRemove={handleRemoveMember}
            />
          ))}
        </div>
      </CardContent>

      <InviteMemberDialog
        open={isOpenInviteDialog}
        onOpenChange={setIsOpenInviteDialog}
        onSuccess={fetchMembers}
      />
    </Card>
  );
}
