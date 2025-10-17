import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const initials = (() => {
    const parts = [firstName, lastName].filter(p => p.trim() !== '');
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'U';
  })();

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await user.update({ firstName, lastName });
      toast.success('Profile updated successfully');    
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      await user.setProfileImage({ file });
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Failed to upload avatar');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  if (!isLoaded) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>
      <div className="rounded-lg border bg-card p-6">
        <form onSubmit={onSave} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.imageUrl} alt="Avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar" className="mb-2 block">Change avatar</Label>
              <Input id="avatar" type="file" accept="image/*" onChange={onAvatarChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          {user?.primaryEmailAddress?.emailAddress && (
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="text-sm text-muted-foreground">{user.primaryEmailAddress.emailAddress}</div>
            </div>
          )}

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;


