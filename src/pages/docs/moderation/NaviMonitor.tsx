import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Activity, Users, Clock, Shield, Wifi, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const NaviMonitor = () => {
  const features = [
    {
      icon: Users,
      title: 'Active User Tracking',
      description: 'See all currently online users with real-time status updates.',
    },
    {
      icon: Activity,
      title: 'Activity Monitoring',
      description: 'Monitor user actions and interactions across the platform.',
    },
    {
      icon: Clock,
      title: 'Session Duration',
      description: 'Track how long users have been active in their current session.',
    },
    {
      icon: MapPin,
      title: 'Route Tracking',
      description: 'See which pages and features users are currently accessing.',
    },
    {
      icon: Wifi,
      title: 'Connection Status',
      description: 'Monitor connection health and detect potential issues.',
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
            <Eye className="w-10 h-10 text-primary" />
            NAVI Monitor
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time user monitoring and activity tracking system.
          </p>
        </div>

        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertTitle>Administrator Access Required</AlertTitle>
          <AlertDescription>
            The NAVI Monitor is only accessible to users with administrator privileges.
          </AlertDescription>
        </Alert>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is NAVI?</h2>
          <p className="text-muted-foreground mb-4">
            NAVI (Network Activity Visibility Interface) is a real-time monitoring system that provides 
            administrators with comprehensive visibility into user activity across the platform. 
            It helps identify potential issues, monitor engagement, and ensure platform security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <feature.icon className="w-5 h-5 text-primary" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Using the Monitor</h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>Navigate to the Moderation Panel at <code className="bg-muted px-2 py-1 rounded">/moderation</code></li>
            <li>Select the "NAVI Monitor" tab</li>
            <li>View the list of currently online users</li>
            <li>Click on any user to see detailed activity information</li>
            <li>Use filters to narrow down the user list</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Privacy Considerations</h2>
          <p className="text-muted-foreground">
            The NAVI Monitor is designed for security and moderation purposes. All monitoring data is 
            handled in accordance with privacy guidelines. User data is only accessible to authorized 
            administrators and is not shared with third parties.
          </p>
        </section>

        <div className="flex gap-4">
          <Link to="/docs/moderation">
            <Button variant="outline">← Overview</Button>
          </Link>
          <Link to="/docs/moderation/actions">
            <Button variant="outline">Moderation Actions →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NaviMonitor;
