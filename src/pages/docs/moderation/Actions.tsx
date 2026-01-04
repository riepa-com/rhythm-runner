import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Gavel, Ban, AlertTriangle, Clock, UserX, MessageSquareOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ModerationActions = () => {
  const actions = [
    {
      icon: AlertTriangle,
      title: 'Warning',
      description: 'Issue a formal warning to a user for minor violations. Warnings are recorded on the user profile.',
      severity: 'Low',
      color: 'text-yellow-500',
    },
    {
      icon: MessageSquareOff,
      title: 'Mute',
      description: 'Temporarily prevent a user from sending messages or participating in discussions.',
      severity: 'Medium',
      color: 'text-orange-500',
    },
    {
      icon: Clock,
      title: 'Temporary Ban',
      description: 'Suspend a user account for a specified duration. User cannot access the platform during this time.',
      severity: 'High',
      color: 'text-red-400',
    },
    {
      icon: Ban,
      title: 'Permanent Ban',
      description: 'Permanently remove a user from the platform. This action should only be used for severe violations.',
      severity: 'Critical',
      color: 'text-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/docs/moderation">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Moderation
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Gavel className="w-10 h-10 text-primary" />
            Moderation Actions
          </h1>
          <p className="text-muted-foreground text-lg">
            Enforcement tools available to administrators and moderators.
          </p>
        </div>

        <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
          <Shield className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Use Responsibly</AlertTitle>
          <AlertDescription>
            All moderation actions are logged and should be used appropriately. 
            Abuse of moderation powers may result in role revocation.
          </AlertDescription>
        </Alert>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Available Actions</h2>
          <div className="space-y-4">
            {actions.map((action) => (
              <Card key={action.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                      {action.title}
                    </CardTitle>
                    <span className={`text-sm font-medium ${action.color}`}>
                      {action.severity}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Action Guidelines</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Progressive Discipline</h3>
              <p>
                Follow a progressive approach: warnings first, then mutes, temporary bans, and permanent 
                bans only as a last resort for repeated or severe violations.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Documentation</h3>
              <p>
                Always document the reason for taking action. Include relevant evidence such as message 
                content, timestamps, and the specific rule violated.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Consistency</h3>
              <p>
                Apply rules consistently across all users. Personal relationships should not affect 
                moderation decisions.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Taking Action</h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>Navigate to the user's profile or find them in the Admin Panel</li>
            <li>Click on the moderation options menu</li>
            <li>Select the appropriate action</li>
            <li>Provide a reason for the action (required)</li>
            <li>For temporary bans, specify the duration</li>
            <li>Confirm the action</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Appeal Process</h2>
          <p className="text-muted-foreground">
            Users who have been banned can appeal by contacting an administrator. Appeals should be 
            reviewed fairly and the original decision may be overturned if appropriate. All appeal 
            decisions should be documented.
          </p>
        </section>

        <div className="flex gap-4">
          <Link to="/docs/moderation/navi">
            <Button variant="outline">← NAVI Monitor</Button>
          </Link>
          <Link to="/docs/moderation/stats">
            <Button variant="outline">Statistics →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModerationActions;
