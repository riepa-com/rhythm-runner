import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, Activity, TrendingUp, Clock, MessageSquare, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Statistics = () => {
  const metrics = [
    {
      icon: Users,
      title: 'User Metrics',
      description: 'Total users, new registrations, active users, and user growth trends.',
    },
    {
      icon: Activity,
      title: 'Activity Metrics',
      description: 'Platform usage, feature engagement, and peak activity times.',
    },
    {
      icon: MessageSquare,
      title: 'Communication Stats',
      description: 'Message volumes, conversation counts, and communication patterns.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'User acquisition trends, retention rates, and platform growth.',
    },
    {
      icon: Clock,
      title: 'Session Analytics',
      description: 'Average session duration, bounce rates, and user engagement time.',
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
            <BarChart3 className="w-10 h-10 text-primary" />
            Statistics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Platform analytics and user activity metrics.
          </p>
        </div>

        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertTitle>Administrator Access Required</AlertTitle>
          <AlertDescription>
            The Statistics Dashboard is only accessible to users with administrator privileges.
          </AlertDescription>
        </Alert>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-muted-foreground mb-4">
            The Statistics Dashboard provides comprehensive analytics about platform usage, user behavior, 
            and system health. Use these insights to make informed decisions about moderation, features, 
            and community management.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Available Metrics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {metrics.map((metric) => (
              <Card key={metric.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <metric.icon className="w-5 h-5 text-primary" />
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{metric.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Accessing Statistics</h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>Navigate to the Moderation Panel at <code className="bg-muted px-2 py-1 rounded">/moderation</code></li>
            <li>Select the "Stats" tab</li>
            <li>View the dashboard with real-time metrics</li>
            <li>Use date filters to view historical data</li>
            <li>Export data if needed for further analysis</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Using Statistics Effectively</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Identify Trends</h3>
              <p>
                Look for patterns in user activity to understand when the platform is most active 
                and plan moderation coverage accordingly.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Monitor Health</h3>
              <p>
                Keep an eye on key metrics like active users and engagement to ensure the platform 
                is healthy and growing.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Inform Decisions</h3>
              <p>
                Use data to make evidence-based decisions about new features, policy changes, 
                and community initiatives.
              </p>
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <Link to="/docs/moderation/actions">
            <Button variant="outline">← Moderation Actions</Button>
          </Link>
          <Link to="/docs/moderation">
            <Button variant="outline">Back to Overview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
