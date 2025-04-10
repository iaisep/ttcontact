
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LimitsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Limits</CardTitle>
        <CardDescription>
          View your current account limits and usage restrictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="text-sm font-medium">API Rate Limits</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium">Concurrent Requests</div>
                <div className="text-xl font-bold">100</div>
                <div className="text-xs text-muted-foreground">Maximum concurrent API requests</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium">Requests per Minute</div>
                <div className="text-xl font-bold">1,000</div>
                <div className="text-xs text-muted-foreground">Maximum API requests per minute</div>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium">Service Limits</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium">Voice Calls</div>
                <div className="text-xl font-bold">Unlimited</div>
                <div className="text-xs text-muted-foreground">Based on your current plan</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium">Knowledge Base Size</div>
                <div className="text-xl font-bold">50 GB</div>
                <div className="text-xs text-muted-foreground">Maximum storage for KB documents</div>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-medium">Account Restrictions</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium">Team Members</div>
                <div className="text-xl font-bold">10</div>
                <div className="text-xs text-muted-foreground">Maximum team members allowed</div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="text-sm font-medium">Phone Numbers</div>
                <div className="text-xl font-bold">20</div>
                <div className="text-xs text-muted-foreground">Maximum phone numbers allowed</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LimitsTab;
