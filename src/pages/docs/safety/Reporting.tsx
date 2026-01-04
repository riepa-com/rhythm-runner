import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Shield, Crown, AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Admin {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

const Reporting = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        // Fetch users with admin role
        const { data: adminRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (rolesError) throw rolesError;

        if (adminRoles && adminRoles.length > 0) {
          const adminIds = adminRoles.map(r => r.user_id);
          
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url')
            .in('id', adminIds);

          if (profilesError) throw profilesError;
          
          setAdmins(profiles || []);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

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
          <h1 className="text-4xl font-bold mb-2">Reporting Issues</h1>
          <p className="text-muted-foreground text-lg">
            How to report problems, abuse, or violations.
          </p>
        </div>

        <Alert className="mb-8 border-primary/50 bg-primary/10">
          <MessageSquare className="h-4 w-4" />
          <AlertTitle>How to Report</AlertTitle>
          <AlertDescription>
            To report any issue, abuse, or violation, simply message an administrator directly using the Messages app. 
            Admins are available to help and will respond as soon as possible.
          </AlertDescription>
        </Alert>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Can Be Reported?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">User Misconduct</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Harassment, spam, inappropriate content, or any behavior that violates community guidelines.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Security Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Suspicious activity, potential exploits, or security vulnerabilities you've discovered.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Bugs & Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Technical issues, broken features, or unexpected behavior in the application.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Content Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Inappropriate or concerning content that needs administrative review.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Current Administrators
          </h2>
          <p className="text-muted-foreground mb-4">
            These are the current administrators you can contact for assistance:
          </p>
          
          {loading ? (
            <div className="text-muted-foreground">Loading administrators...</div>
          ) : admins.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Administrators Found</AlertTitle>
              <AlertDescription>
                Unable to load administrator list. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {admins.map((admin) => (
                <Card key={admin.id} className="bg-yellow-500/5 border-yellow-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={admin.avatar_url || undefined} />
                        <AvatarFallback>
                          {(admin.display_name || admin.username || 'A').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {admin.display_name || admin.username}
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">@{admin.username}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reporting Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Be clear and specific about the issue</li>
            <li>Include relevant details like usernames, timestamps, or screenshots</li>
            <li>Explain what happened and why it's a concern</li>
            <li>Be patient - admins will respond as soon as they can</li>
            <li>Don't spam multiple admins with the same report</li>
          </ul>
        </section>

        <div className="flex gap-4">
          <Link to="/docs/safety/account">
            <Button variant="outline">← Account Safety</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
