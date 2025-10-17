import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

export default function OrganizationInfoForm({ orgName, setOrgName, isAdmin, isUpdating, onSubmit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Organization Information
        </CardTitle>
        <CardDescription>Update your organization details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={!isAdmin}
              required
            />
          </div>
          {isAdmin && (
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Organization'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
