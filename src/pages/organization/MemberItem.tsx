import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, User, Trash2 } from 'lucide-react';

export default function MemberItem({ member, currentUserId, isAdmin, onRemove }) {
  const isCurrentUser = member.publicUserData?.userId === currentUserId;
  const isMemberAdmin = member.role === 'admin' || member.role === 'org:admin';

  const { firstName, lastName, imageUrl, identifier } = member.publicUserData || {};
  const name = `${firstName || ''} ${lastName || ''}`.trim() || identifier || 'Unknown User';

  const canRemove = !isMemberAdmin && !isCurrentUser; 

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      {/* Avatar + Info */}
      <div className="flex items-center gap-3">
        <Avatar>
          {imageUrl ? (
            <AvatarImage src={imageUrl} />
          ) : (
            <AvatarFallback>{name[0]?.toUpperCase() || 'U'}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{identifier}</div>
        </div>
      </div>

      {/* Role + Actions */}
      <div className="flex items-center gap-2">
        <Badge variant={isMemberAdmin ? 'default' : 'secondary'}>
          {isMemberAdmin ? (
            <>
              <Crown className="h-3 w-3 mr-1" /> Admin
            </>
          ) : (
            <>
              <User className="h-3 w-3 mr-1" /> Member
            </>
          )}
        </Badge>

        {/* Nút xóa chỉ hiển thị nếu là admin đang xem và member đó không phải admin */}
        {isAdmin && canRemove && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(member.publicUserData.userId)}
            title="Remove member"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
