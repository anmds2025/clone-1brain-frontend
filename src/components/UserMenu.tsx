import { useEffect, useMemo } from 'react';
import { useClerk, useUser, useOrganizationList } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const { signOut } = useClerk();
    const { user } = useUser();
    const { isLoaded } = useOrganizationList();
  const navigate = useNavigate();

  const displayName = useMemo(() => {
    if (!user) return '';
    return (
      user.fullName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      'User'
    );
  }, [user]);

  const email = user?.primaryEmailAddress?.emailAddress;
  const avatarUrl = user?.imageUrl;
  const initials = useMemo(() => {
    if (!displayName) return 'U';
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    return (
      parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('') || 'U'
    );
  }, [displayName]);

  const isAdmin = useMemo(() => {
    if (!isLoaded || !user) return false;
    const memberships = user.organizationMemberships ?? [];
    return memberships.some(
      (m) => m.role === "admin" || m.role === "org:admin"
    );
  }, [user, isLoaded]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate font-medium">{displayName}</div>
              {email && (
                <div className="truncate text-xs text-muted-foreground">
                  {email}
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate('/profile')}>
          Profile
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/organization')}>
            Organization
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
