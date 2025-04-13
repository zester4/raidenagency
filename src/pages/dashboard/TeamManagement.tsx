
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  Users, 
  UserCheck, 
  Shield, 
  Mail, 
  Clock, 
  MoreHorizontal, 
  Check, 
  X,
  Settings,
  Key,
  Lock,
  Award
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamMember {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  name?: string;
  invited_at: string;
  status: 'active' | 'pending' | 'disabled';
  last_active?: string;
}

interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invited_at: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired';
}

const TeamManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch team data from Supabase
        // For now, we'll use mock data
        
        // Mock current user as admin
        const currentUserMock: TeamMember = {
          id: user?.id || 'current-user',
          email: user?.email || 'current@example.com',
          name: getUserName(),
          role: 'admin',
          invited_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          last_active: new Date().toISOString(),
        };
        
        // Mock team members
        const mockTeamMembers: TeamMember[] = [
          currentUserMock,
          {
            id: 'user-2',
            email: 'team.member@example.com',
            name: 'Team Member',
            role: 'member',
            invited_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            last_active: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'user-3',
            email: 'viewer@example.com',
            name: 'Viewer Only',
            role: 'viewer',
            invited_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ];
        
        // Mock invitations
        const mockInvitations: Invitation[] = [
          {
            id: 'invite-1',
            email: 'pending@example.com',
            role: 'member',
            invited_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
          }
        ];
        
        setTeamMembers(mockTeamMembers);
        setInvitations(mockInvitations);
      } catch (error) {
        console.error('Error fetching team data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load team data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [user, toast]);

  const getUserName = () => {
    if (!user) return 'User';
    
    const metadata = user.user_metadata;
    if (metadata && metadata.first_name && metadata.last_name) {
      return `${metadata.first_name} ${metadata.last_name}`;
    }
    
    return user.email?.split('@')[0] || 'User';
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      const nameParts = name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    
    return email.substring(0, 2).toUpperCase();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send an invitation via Supabase
      // For now, just simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to invitations list
      const newInvitation: Invitation = {
        id: `invite-${Date.now()}`,
        email: inviteEmail,
        role: inviteRole,
        invited_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      };
      
      setInvitations([...invitations, newInvitation]);
      
      toast({
        title: 'Invitation sent',
        description: `Invitation email sent to ${inviteEmail}`,
      });
      
      setIsInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('member');
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    try {
      // In a real implementation, this would revoke the invitation via Supabase
      // For now, just remove from the local state
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      toast({
        title: 'Invitation revoked',
        description: 'The invitation has been revoked successfully',
      });
    } catch (error) {
      console.error('Error revoking invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke invitation',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: 'admin' | 'member' | 'viewer') => {
    try {
      // In a real implementation, this would update the user's role via Supabase
      // For now, just update the local state
      setTeamMembers(teamMembers.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));
      
      toast({
        title: 'Role updated',
        description: 'Team member role has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    // Prevent removing yourself
    if (memberId === user?.id) {
      toast({
        title: 'Cannot remove yourself',
        description: 'You cannot remove your own account from the team',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // In a real implementation, this would remove the user via Supabase
      // For now, just update the local state
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      
      toast({
        title: 'Member removed',
        description: 'Team member has been removed successfully',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove team member',
        variant: 'destructive',
      });
    }
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-600">Admin</Badge>;
      case 'member':
        return <Badge className="bg-blue-600">Member</Badge>;
      case 'viewer':
        return <Badge className="bg-gray-600">Viewer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-electric-blue" />
            <h1 className="text-2xl font-bold">Team Management</h1>
          </div>
          
          <Button
            onClick={() => setIsInviteDialogOpen(true)}
            className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/90"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Team Member
          </Button>
        </div>
        
        <Tabs defaultValue="members" className="mb-8">
          <TabsList className="bg-black/30 border border-gray-800">
            <TabsTrigger value="members" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> Members
            </TabsTrigger>
            <TabsTrigger value="invitations" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <Mail className="h-4 w-4" /> Invitations
            </TabsTrigger>
            <TabsTrigger value="roles" className="data-[state=active]:bg-electric-blue/10 flex items-center gap-2">
              <Shield className="h-4 w-4" /> Roles & Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4 mt-4">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <UserCheck className="h-5 w-5 text-electric-blue mr-2" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Manage the members of your team and their access levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id} className="border-gray-800">
                          <TableCell className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-electric-blue/20 text-white">
                                {getInitials(member.name || '', member.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name || 'No name'}</div>
                              <div className="text-xs text-gray-400">{member.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {renderRoleBadge(member.role)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={member.status === 'active' ? 'success' : 'outline'}>
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">
                                {member.last_active ? getTimeAgo(member.last_active) : 'Never'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-black/90 border-gray-800">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-800" />
                                <DropdownMenuItem
                                  onSelect={() => handleUpdateMemberRole(member.id, 'admin')}
                                  disabled={member.role === 'admin' || member.id === user?.id}
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => handleUpdateMemberRole(member.id, 'member')}
                                  disabled={member.role === 'member'}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Make Member
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => handleUpdateMemberRole(member.id, 'viewer')}
                                  disabled={member.role === 'viewer'}
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  Make Viewer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-800" />
                                <DropdownMenuItem
                                  onSelect={() => handleRemoveMember(member.id)}
                                  disabled={member.id === user?.id}
                                  className="text-red-500 focus:text-red-500"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Remove from Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4 mt-4">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mail className="h-5 w-5 text-electric-blue mr-2" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  View and manage pending team invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : invitations.length === 0 ? (
                  <div className="text-center py-6">
                    <Mail className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Pending Invitations</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      There are no pending invitations at the moment
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsInviteDialogOpen(true)}
                      className="border-gray-700"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite a Team Member
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Invited</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invitations.map((invitation) => (
                        <TableRow key={invitation.id} className="border-gray-800">
                          <TableCell>
                            <div className="font-medium">{invitation.email}</div>
                          </TableCell>
                          <TableCell>
                            {renderRoleBadge(invitation.role)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{getTimeAgo(invitation.invited_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(invitation.expires_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRevokeInvite(invitation.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Revoke
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                <div className="text-sm text-gray-400">
                  Invitations expire after 7 days
                </div>
                <Button
                  onClick={() => setIsInviteDialogOpen(true)}
                  variant="default"
                  className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/90"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Team Member
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4 mt-4">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 text-electric-blue mr-2" />
                  Roles & Permissions
                </CardTitle>
                <CardDescription>
                  Learn about the different roles and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-gray-800 bg-black/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Shield className="h-4 w-4 text-red-500 mr-2" />
                        Admin
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-400 mb-4">
                        Full control over the organization, including user management and billing.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Create and manage all agents</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Invite and manage team members</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Access billing and subscription</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Configure API keys and integrations</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Access all organization data</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-800 bg-black/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <UserCheck className="h-4 w-4 text-blue-500 mr-2" />
                        Member
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-400 mb-4">
                        Can create and use agents, but cannot manage team members or billing.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Create and manage their agents</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Use shared organization agents</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Upload documents to knowledge base</span>
                        </li>
                        <li className="flex items-center">
                          <X className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-gray-400">Cannot manage team members</span>
                        </li>
                        <li className="flex items-center">
                          <X className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-gray-400">Cannot access billing</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-800 bg-black/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                        Viewer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <p className="text-sm text-gray-400 mb-4">
                        Read-only access to agents and data. Cannot create or modify anything.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Use existing agents</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>View analytics and reports</span>
                        </li>
                        <li className="flex items-center">
                          <X className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-gray-400">Cannot create new agents</span>
                        </li>
                        <li className="flex items-center">
                          <X className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-gray-400">Cannot modify existing agents</span>
                        </li>
                        <li className="flex items-center">
                          <X className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-gray-400">Cannot upload documents</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Security Settings</h3>
                  <div className="space-y-4">
                    <Card className="border-gray-800 bg-black/30 p-4">
                      <div className="flex items-start space-x-3">
                        <Key className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">API Key Access</h4>
                          <p className="text-sm text-gray-400">
                            Control which roles can create and manage API keys for accessing the Raiden API.
                          </p>
                          <div className="flex mt-2 space-x-2">
                            <Badge className="bg-red-600">Admin</Badge>
                            <Badge className="bg-blue-600">Member</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="border-gray-800 bg-black/30 p-4">
                      <div className="flex items-start space-x-3">
                        <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-400">
                            Enforce two-factor authentication for specific roles to enhance security.
                          </p>
                          <div className="flex mt-2 space-x-2">
                            <Badge className="bg-red-600">Admin</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="border-gray-800 bg-black/30 p-4">
                      <div className="flex items-start space-x-3">
                        <Award className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Custom Role Creation</h4>
                          <p className="text-sm text-gray-400">
                            Available on Enterprise plans. Create custom roles with specific permissions.
                          </p>
                          <Button variant="outline" className="mt-2 bg-black/30 border-gray-700">
                            <Settings className="h-4 w-4 mr-2" />
                            Upgrade to Enterprise
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="bg-black/80 backdrop-blur-sm border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-electric-blue" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation to add someone to your team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-black/30 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={inviteRole} 
                onValueChange={(value) => setInviteRole(value as 'admin' | 'member' | 'viewer')}
              >
                <SelectTrigger className="bg-black/30 border-gray-700">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-gray-700">
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-red-500 mr-2" />
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="member">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Member</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Viewer</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-xs text-gray-400 mt-1">
                {inviteRole === 'admin' ? 
                  'Admins have full control over the organization, including user management and billing.' :
                 inviteRole === 'member' ? 
                  'Members can create and use agents, but cannot manage team members or billing.' :
                  'Viewers have read-only access to agents and data. They cannot create or modify anything.'}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvite}
              className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/90"
              disabled={isSubmitting || !inviteEmail.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeamManagement;
