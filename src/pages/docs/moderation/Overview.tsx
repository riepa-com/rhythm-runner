import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Crown, Eye, Users, Gavel, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ModerationOverview = () => {
  const sections = [
    {
      icon: Shield,
      title: 'NAVI Monitor',
      description: 'Real-time user monitoring and activity tracking system.',
      link: '/docs/moderation/navi',
    },
    {
      icon: Gavel,
      title: 'Moderation Actions',
      description: 'Bans, warnings, and other enforcement tools.',
      link: '/docs/moderation/actions',
    },
    {
      icon: Eye,
      title: 'Statistics Dashboard',
      description: 'Platform analytics and user activity metrics.',
      link: '/docs/moderation/stats',
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
          <h1 className="text-4xl font-bold mb-2">Moderation Overview</h1>
          <p className="text-muted-foreground text-lg">
            Tools and systems for platform moderation and administration.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">About Moderation</h2>
          <p className="text-muted-foreground mb-4">
            The moderation system provides administrators and moderators with the tools they need 
            to maintain a safe and healthy community. Access is restricted based on user roles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Role Hierarchy</h2>
          <div className="space-y-4">
            <Card className="bg-yellow-500/5 border-yellow-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Administrator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Full access to all moderation tools, user management, system settings, and the moderation panel.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Moderator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access to user warnings, temporary bans, and content moderation. Cannot access system settings.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Moderation Tools</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {sections.map((section) => (
              <Link to={section.link} key={section.title}>
                <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <section.icon className="w-5 h-5 text-primary" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{section.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Accessing the Moderation Panel</h2>
          <p className="text-muted-foreground">
            The moderation panel can be accessed by administrators and moderators at{' '}
            <code className="bg-muted px-2 py-1 rounded">/moderation</code>. 
            You must be logged in with an account that has the appropriate role to access this area.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ModerationOverview;
