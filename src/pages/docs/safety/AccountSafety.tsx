import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Key, AlertTriangle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AccountSafety = () => {
  const safetyTips = [
    {
      icon: Lock,
      title: 'Use a Strong Password',
      description: 'Create a unique password with at least 12 characters, mixing letters, numbers, and symbols.',
    },
    {
      icon: Key,
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security by enabling 2FA in your account settings.',
    },
    {
      icon: Eye,
      title: 'Review Login Activity',
      description: 'Regularly check your login history for any suspicious activity.',
    },
    {
      icon: Smartphone,
      title: 'Secure Your Devices',
      description: 'Keep your devices updated and use secure networks when accessing your account.',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/docs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Docs
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Account Safety</h1>
          <p className="text-muted-foreground text-lg">
            Keep your account secure with these best practices.
          </p>
        </div>

        <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Never share your password or account credentials with anyone, including staff members. 
            Administrators will never ask for your password.
          </AlertDescription>
        </Alert>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Security Best Practices</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {safetyTips.map((tip) => (
              <Card key={tip.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <tip.icon className="w-5 h-5 text-primary" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tip.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recognizing Threats</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Phishing Attempts</h3>
              <p>
                Be wary of messages asking you to click suspicious links or provide personal information. 
                Official communications will never ask for your password.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Impersonation</h3>
              <p>
                Verify user badges before trusting someone claiming to be staff. 
                Check for the official Administrator or Moderator badge next to their username.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Suspicious Activity</h3>
              <p>
                If you notice unfamiliar logins or changes to your account, change your password immediately 
                and contact an administrator.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">If Your Account is Compromised</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Change your password immediately</li>
            <li>Enable two-factor authentication if not already enabled</li>
            <li>Review and revoke any suspicious sessions</li>
            <li>Check your account settings for unauthorized changes</li>
            <li>Report the incident to an administrator</li>
          </ol>
        </section>

        <div className="flex gap-4">
          <Link to="/docs/safety/badges">
            <Button variant="outline">← Badges</Button>
          </Link>
          <Link to="/docs/safety/reporting">
            <Button variant="outline">Reporting →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountSafety;
