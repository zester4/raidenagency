
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  UserPlus, 
  MailPlus, 
  BadgeCheck, 
  Edit, 
  Trash2, 
  Lock, 
  UserCog, 
  Settings, 
  User, 
  Building, 
  GroupIcon,
  BookOpen,
  Shield,
  Layers,
  MessageSquare,
  Key,
  UserIcon,
  XIcon,
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  teams?: string[];
}

interface Team {
  id: string;
  name: string;
  description: string;
  members_count: number;
  created_by: string;
  created_at: string;
}

const ROLES = [
  { id: 'admin', name: 'Admin', description: 'Full access to all resources' },
  { id: 'manager', name: 'Manager', description: 'Can manage teams and members' },
  { id: 'member', name: 'Member', description: 'Regular member access' },
  { id: 'viewer', name: 'Viewer', description: 'View-only access' },
];

const TeamManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteMessage, setInviteMessage] = useState('');

  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('member');
  const [newUserAvatar, setNewUserAvatar] = useState('');

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newTeamMembers, setNewTeamMembers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from your API
      const mockUsers: UserProfile[] = [
        {
          id: '1',
          email: 'admin@example.com',
          full_name: 'Admin User',
          role: 'admin',
          is_active: true,
          created_at: '2023-01-01T00:00:00Z',
          teams: ['1', '2']
        },
        {
          id: '2',
          email: 'manager@example.com',
          full_name: 'Manager User',
          role: 'manager',
          is_active: true,
          created_at: '2023-01-02T00:00:00Z',
          teams: ['1']
        },
        {
          id: '3',
          email: 'member@example.com',
          full_name: 'Team Member',
          role: 'member',
          is_active: true,
          created_at: '2023-01-03T00:00:00Z',
          teams: ['2']
        },
        {
          id: '4',
          email: 'viewer@example.com',
          full_name: 'Viewer User',
          role: 'viewer',
          is_active: true,
          created_at: '2023-01-04T00:00:00Z',
          teams: []
        },
        {
          id: '5',
          email: 'inactive@example.com',
          full_name: 'Inactive User',
          role: 'member',
          is_active: false,
          created_at: '2023-01-05T00:00:00Z',
          teams: []
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      // In a real app, this would fetch from your API
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Engineering',
          description: 'Software development team',
          members_count: 3,
          created_by: '1',
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Customer Support',
          description: 'Customer-facing support team',
          members_count: 2,
          created_by: '1',
          created_at: '2023-01-02T00:00:00Z'
        }
      ];
      
      setTeams(mockTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch teams',
        variant: 'destructive',
      });
    }
  };

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${inviteEmail}`,
        variant: 'outline',
      });
      
      setInviteEmail('');
      setInviteRole('member');
      setInviteMessage('');
      setIsInviteDialogOpen(false);
    }, 1000);
  };

  const handleCreateUser = () => {
    if (!newUserEmail.trim() || !newUserFullName.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: newUserEmail,
      full_name: newUserFullName,
      avatar_url: newUserAvatar || undefined,
      role: newUserRole,
      is_active: true,
      created_at: new Date().toISOString(),
      teams: []
    };
    
    setUsers([...users, newUser]);
    
    toast({
      title: 'User created',
      description: `User ${newUserFullName} has been created successfully`,
      variant: 'outline',
    });
    
    setNewUserEmail('');
    setNewUserFullName('');
    setNewUserRole('member');
    setNewUserAvatar('');
    setIsUserDialogOpen(false);
  };

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a team name',
        variant: 'destructive',
      });
      return;
    }
    
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: newTeamName,
      description: newTeamDescription,
      members_count: newTeamMembers.length,
      created_by: '1', // current user ID in a real app
      created_at: new Date().toISOString()
    };
    
    setTeams([...teams, newTeam]);
    
    toast({
      title: 'Team created',
      description: `Team ${newTeamName} has been created successfully`,
      variant: 'outline',
    });
    
    setNewTeamName('');
    setNewTeamDescription('');
    setNewTeamMembers([]);
    setIsTeamDialogOpen(false);
  };

  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'outline';
      case 'member':
        return 'default';
      case 'viewer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleToggleUserActive = (userId: string, isActive: boolean) => {
    setUsers(
      users.map(user => 
        user.id === userId ? { ...user, is_active: isActive } : user
      )
    );
    
    toast({
      title: isActive ? 'User activated' : 'User deactivated',
      description: `User has been ${isActive ? 'activated' : 'deactivated'} successfully`,
      variant: isActive ? 'outline' : 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Team Management</CardTitle>
              <CardDescription>
                Manage your users, teams, and permissions
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <MailPlus className="h-4 w-4" />
                    Invite User
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 border-gray-800">
                  <DialogHeader>
                    <DialogTitle>Invite New User</DialogTitle>
                    <DialogDescription>
                      Send an invitation email to add a new user to the platform.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        placeholder="user@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="bg-black/50 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={inviteRole}
                        onValueChange={setInviteRole}
                      >
                        <SelectTrigger className="bg-black/50 border-gray-700">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name} - {role.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a personal message to the invitation email"
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        className="bg-black/50 border-gray-700 min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInviteUser}>
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 border-gray-800">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Add a new user manually to the platform.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={newUserFullName}
                        onChange={(e) => setNewUserFullName(e.target.value)}
                        className="bg-black/50 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email Address</Label>
                      <Input
                        id="userEmail"
                        placeholder="user@example.com"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="bg-black/50 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userRole">Role</Label>
                      <Select
                        value={newUserRole}
                        onValueChange={setNewUserRole}
                      >
                        <SelectTrigger id="userRole" className="bg-black/50 border-gray-700">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                      <Input
                        id="avatar"
                        placeholder="https://example.com/avatar.jpg"
                        value={newUserAvatar}
                        onChange={(e) => setNewUserAvatar(e.target.value)}
                        className="bg-black/50 border-gray-700"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateUser}>
                      Create User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users">
            <TabsList className="bg-black/30 border border-gray-800 mb-6">
              <TabsTrigger value="users" className="data-[state=active]:bg-electric-blue/10">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-electric-blue/10">
                <GroupIcon className="h-4 w-4 mr-2" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="roles" className="data-[state=active]:bg-electric-blue/10">
                <Shield className="h-4 w-4 mr-2" />
                Roles
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-800">
                      <h3 className="font-medium">Users ({users.length})</h3>
                    </div>
                    
                    <ScrollArea className="h-[460px]">
                      <div className="space-y-1 p-2">
                        {users.map((user) => (
                          <button
                            key={user.id}
                            className={`w-full text-left p-2 rounded flex items-center gap-3 transition-colors ${
                              selectedUser?.id === user.id
                                ? 'bg-electric-blue/20 text-electric-blue'
                                : 'hover:bg-gray-800/70'
                            }`}
                            onClick={() => handleUserClick(user)}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-800 text-gray-300">
                                {user.full_name
                                  ? user.full_name.split(' ').map(n => n[0]).join('')
                                  : user.email.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                              {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                              <div className="font-medium truncate">
                                {user.full_name || 'Unnamed User'}
                              </div>
                              <div className="text-xs text-gray-400 truncate">{user.email}</div>
                            </div>
                            <Badge variant={getRoleBadgeVariant(user.role)} className="ml-auto">
                              {user.role}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Building className="h-4 w-4" />
                          Create Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/90 border-gray-800">
                        <DialogHeader>
                          <DialogTitle>Create New Team</DialogTitle>
                          <DialogDescription>
                            Create a new team and add members to it.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="teamName">Team Name</Label>
                            <Input
                              id="teamName"
                              placeholder="Engineering Team"
                              value={newTeamName}
                              onChange={(e) => setNewTeamName(e.target.value)}
                              className="bg-black/50 border-gray-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="teamDescription">Description</Label>
                            <Textarea
                              id="teamDescription"
                              placeholder="A brief description of the team's purpose"
                              value={newTeamDescription}
                              onChange={(e) => setNewTeamDescription(e.target.value)}
                              className="bg-black/50 border-gray-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="teamMembers">Initial Members</Label>
                            <Select>
                              <SelectTrigger className="bg-black/50 border-gray-700">
                                <SelectValue placeholder="Select members to add" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {users
                                    .filter(u => u.is_active)
                                    .map((user) => (
                                      <SelectItem key={user.id} value={user.id}>
                                        {user.full_name || user.email}
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateTeam}>
                            Create Team
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {selectedUser ? (
                    <div className="bg-black/40 rounded-lg border border-gray-800 h-full">
                      <div className="p-6 border-b border-gray-800">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="bg-gray-800 text-gray-200 text-xl">
                                {selectedUser.full_name
                                  ? selectedUser.full_name.split(' ').map(n => n[0]).join('')
                                  : selectedUser.email.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                              {selectedUser.avatar_url && <AvatarImage src={selectedUser.avatar_url} />}
                            </Avatar>
                            <div>
                              <h2 className="text-xl font-medium">{selectedUser.full_name || 'Unnamed User'}</h2>
                              <div className="text-gray-400">{selectedUser.email}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                                  {selectedUser.role}
                                </Badge>
                                {selectedUser.is_active ? (
                                  <Badge variant="success">Active</Badge>
                                ) : (
                                  <Badge variant="destructive">Inactive</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Account Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-400">User ID</div>
                              <div>{selectedUser.id}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Created At</div>
                              <div>{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Status</div>
                              <div className="flex items-center gap-2">
                                <Switch 
                                  checked={selectedUser.is_active}
                                  onCheckedChange={(checked) => handleToggleUserActive(selectedUser.id, checked)}
                                />
                                <span>{selectedUser.is_active ? 'Active' : 'Inactive'}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Account Role</div>
                              <Select defaultValue={selectedUser.role}>
                                <SelectTrigger className="bg-black/50 border-gray-700 mt-1 w-full">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ROLES.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Teams</h3>
                          <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <div className="bg-black/40 p-3 border-b border-gray-800 flex justify-between items-center">
                              <div>Assigned Teams</div>
                              <Button variant="outline" size="sm">
                                Add to Team
                              </Button>
                            </div>
                            <div className="p-4">
                              {selectedUser.teams && selectedUser.teams.length > 0 ? (
                                <div className="space-y-2">
                                  {selectedUser.teams.map(teamId => {
                                    const team = teams.find(t => t.id === teamId);
                                    return team ? (
                                      <div key={team.id} className="flex justify-between items-center p-2 bg-black/20 rounded-md">
                                        <div className="flex items-center gap-2">
                                          <Building className="h-4 w-4 text-gray-400" />
                                          <span>{team.name}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <XIcon className="h-4 w-4 text-gray-400" />
                                        </Button>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  This user is not assigned to any teams
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Permissions</h3>
                          <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <div className="bg-black/40 p-3 border-b border-gray-800">
                              <div>Access Permissions</div>
                            </div>
                            <div className="p-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                    <span>Access Knowledge Base</span>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-gray-400" />
                                    <span>Manage Workflows</span>
                                  </div>
                                  <Switch defaultChecked={selectedUser.role === 'admin' || selectedUser.role === 'manager'} />
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-gray-400" />
                                    <span>Security Settings</span>
                                  </div>
                                  <Switch defaultChecked={selectedUser.role === 'admin'} />
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                    <span>User Management</span>
                                  </div>
                                  <Switch defaultChecked={selectedUser.role === 'admin'} />
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Key className="h-4 w-4 text-gray-400" />
                                    <span>API Access</span>
                                  </div>
                                  <Switch defaultChecked={selectedUser.role !== 'viewer'} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-black/40 rounded-lg border border-gray-800 h-full flex flex-col items-center justify-center p-12 text-center">
                      <UserIcon className="h-16 w-16 text-gray-700 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No User Selected</h3>
                      <p className="text-gray-500 max-w-md">
                        Select a user from the list to view and manage their details, or create a new user to get started.
                      </p>
                      <Button className="mt-4" onClick={() => setIsUserDialogOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create New User
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="teams" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-800">
                      <h3 className="font-medium">Teams ({teams.length})</h3>
                    </div>
                    
                    <ScrollArea className="h-[460px]">
                      <div className="space-y-1 p-2">
                        {teams.map((team) => (
                          <button
                            key={team.id}
                            className={`w-full text-left p-3 rounded flex items-center gap-3 transition-colors ${
                              selectedTeam?.id === team.id
                                ? 'bg-electric-blue/20 text-electric-blue'
                                : 'hover:bg-gray-800/70'
                            }`}
                            onClick={() => handleTeamClick(team)}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{team.name}</div>
                              <div className="text-xs text-gray-400">
                                {team.members_count} {team.members_count === 1 ? 'member' : 'members'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => setIsTeamDialogOpen(true)}>
                      <Building className="h-4 w-4 mr-2" />
                      Create Team
                    </Button>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {selectedTeam ? (
                    <div className="bg-black/40 rounded-lg border border-gray-800 h-full">
                      <div className="p-6 border-b border-gray-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-medium">{selectedTeam.name}</h2>
                            <div className="text-gray-400">{selectedTeam.description}</div>
                            <div className="mt-1 text-sm text-gray-500">
                              Created {new Date(selectedTeam.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Members</h3>
                            <Button variant="outline" size="sm">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Member
                            </Button>
                          </div>
                          
                          <div className="border border-gray-800 rounded-lg overflow-hidden">
                            <div className="bg-black/40 p-3 border-b border-gray-800 grid grid-cols-4">
                              <div className="col-span-2">User</div>
                              <div>Role</div>
                              <div>Actions</div>
                            </div>
                            <div>
                              {users
                                .filter(user => 
                                  user.teams && user.teams.includes(selectedTeam.id)
                                )
                                .map((user) => (
                                  <div 
                                    key={user.id} 
                                    className="grid grid-cols-4 items-center p-3 border-b border-gray-800 last:border-0"
                                  >
                                    <div className="col-span-2 flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-gray-800 text-gray-300">
                                          {user.full_name
                                            ? user.full_name.split(' ').map(n => n[0]).join('')
                                            : user.email.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                        {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">
                                          {user.full_name || 'Unnamed User'}
                                        </div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                      </div>
                                    </div>
                                    <div>
                                      <Badge variant={getRoleBadgeVariant(user.role)}>
                                        {user.role}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <XIcon className="h-4 w-4 text-gray-400" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              
                              {users.filter(user => 
                                user.teams && user.teams.includes(selectedTeam.id)
                              ).length === 0 && (
                                <div className="text-center py-6 text-gray-500">
                                  No members in this team
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Team Settings</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="teamName">Team Name</Label>
                                <Input
                                  id="teamName"
                                  defaultValue={selectedTeam.name}
                                  className="bg-black/50 border-gray-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="teamVisibility">Visibility</Label>
                                <Select defaultValue="private">
                                  <SelectTrigger className="bg-black/50 border-gray-700">
                                    <SelectValue placeholder="Select visibility" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="private">Private</SelectItem>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="restricted">Restricted</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="teamDescription">Description</Label>
                              <Textarea
                                id="teamDescription"
                                defaultValue={selectedTeam.description}
                                className="bg-black/50 border-gray-700"
                              />
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-400 mb-2">Permissions</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-gray-400" />
                                    <span>Allow team chat</span>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4 text-gray-400" />
                                    <span>Members can invite others</span>
                                  </div>
                                  <Switch />
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-gray-400" />
                                    <span>Members can change settings</span>
                                  </div>
                                  <Switch />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-black/40 rounded-lg border border-gray-800 h-full flex flex-col items-center justify-center p-12 text-center">
                      <Building className="h-16 w-16 text-gray-700 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Team Selected</h3>
                      <p className="text-gray-500 max-w-md">
                        Select a team from the list to view and manage its details, or create a new team to get started.
                      </p>
                      <Button className="mt-4" onClick={() => setIsTeamDialogOpen(true)}>
                        <Building className="h-4 w-4 mr-2" />
                        Create New Team
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="roles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ROLES.map(role => (
                  <Card key={role.id} className="border-gray-800 bg-black/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle>{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-gray-400" />
                            <span>User Management</span>
                          </div>
                          <Switch defaultChecked={role.id === 'admin'} />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-gray-400" />
                            <span>System Settings</span>
                          </div>
                          <Switch defaultChecked={role.id === 'admin'} />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span>Team Management</span>
                          </div>
                          <Switch defaultChecked={role.id === 'admin' || role.id === 'manager'} />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <span>Content Creation</span>
                          </div>
                          <Switch defaultChecked={role.id !== 'viewer'} />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                            <span>API Keys</span>
                          </div>
                          <Switch defaultChecked={role.id === 'admin'} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-800 pt-4">
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Role
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
