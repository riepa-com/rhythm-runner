import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Crown, Star, Award, CheckCircle, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Badges = () => {
  const badges = [
    {
      name: 'Administrator',
      icon: Crown,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      description: 'Site administrators with full access to moderation tools and system settings.',
    },
    {
      name: 'Moderator',
      icon: Shield,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'Community moderators who help maintain order and enforce guidelines.',
    },
    {
      name: 'VIP',
      icon: Star,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'VIP users with special privileges and early access to features.',
    },
    {
      name: 'Verified',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'Verified accounts that have confirmed their identity.',
    },
    {
      name: 'Contributor',
      icon: Sparkles,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      description: 'Users who have contributed to the project in meaningful ways.',
    },
    {
      name: 'Developer',
      icon: Wrench,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description: 'Development team members working on the platform.',
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
          <h1 className="text-4xl font-bold mb-2">User Badges</h1>
          <p className="text-muted-foreground text-lg">
            Understanding the different badges and what they represent.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are Badges?</h2>
          <p className="text-muted-foreground mb-4">
            Badges are visual indicators that appear next to usernames throughout the platform. 
            They help identify user roles, special status, and contributions to the community.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Badge Types</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {badges.map((badge) => (
              <Card key={badge.name} className={badge.bgColor}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <badge.icon className={`w-5 h-5 ${badge.color}`} />
                    <span>{badge.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{badge.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Earn Badges</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Administrator</strong> - Assigned by the site owner only</li>
            <li><strong>Moderator</strong> - Appointed by administrators</li>
            <li><strong>VIP</strong> - Granted for exceptional contributions or support</li>
            <li><strong>Verified</strong> - Complete the verification process in account settings</li>
            <li><strong>Contributor</strong> - Submit accepted contributions to the project</li>
            <li><strong>Developer</strong> - Join the development team</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Badge Hierarchy</h2>
          <p className="text-muted-foreground mb-4">
            When a user has multiple badges, they are displayed in order of importance. 
            Administrator badges always appear first, followed by Moderator, then others.
          </p>
        </section>

        <div className="flex gap-4">
          <Link to="/docs/safety/account">
            <Button variant="outline">Account Safety →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Badges;
