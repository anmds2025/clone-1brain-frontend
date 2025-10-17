import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function PendingInvitationsSection({ organization }) {
    const [invitations, setInvitations] = useState([]);

    const fetchInvitations = async () => {
        try {
            const list = await organization.getInvitations();
            setInvitations(list.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch invitations');
        }
    };

    const handleCopyLink = async (inviteId: string) => {
        try {
            // Clerk không tự sinh public URL, bạn có thể tự tạo link như sau:
            const baseUrl = window.location.origin;
            const inviteLink = `${baseUrl}/sign-up?invite_id=${inviteId}`;
            await navigator.clipboard.writeText(inviteLink);
            toast.success('Copied invitation link!');
            } catch {
            toast.error('Failed to copy link');
        }
    };

    useEffect(() => {
        if (organization) fetchInvitations();
    }, [organization]);

    if (!invitations.length) return null;

    return (
        <Card className="mt-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Invitations ({invitations.length})
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {invitations.map((inv) => (
                <div
                key={inv.id}
                className="flex items-center justify-between p-3 border rounded-lg"
                >
                <div>
                    <div className="font-medium">{inv.emailAddress}</div>
                    <div className="text-sm text-muted-foreground">
                    Role: {inv.role}
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(inv.id)}
                >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Link Invite
                </Button>
                </div>
            ))}
            </div>
        </CardContent>
        </Card>
    );
}
