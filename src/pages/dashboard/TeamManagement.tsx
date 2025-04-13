import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings, 
  ShieldCheck, 
  Calendar, 
  Mail, 
  Check, 
  X, 
  Edit,
  Trash,
  CreditCard,
  Key,
  Download,
  Clipboard,
  Share,
  UserX,
  AlertTriangle,
  User,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    picture: string;
    provider_id: string;
    sub: string;
  };
}

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isApiKeyLoading, setIsApiKeyLoading] = useState(false);
  const [isApiKeyCopied, setIsApiKeyCopied] = useState(false);
  const [isApiKeyRegenerated, setIsApiKeyRegenerated] = useState(false);
  const [isApiKeyRevoked, setIsApiKeyRevoked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const { data: users, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error('Error fetching team members:', error);
        toast({
          title: "Error fetching team members",
          description: "Failed to load team members. Please try again.",
          variant: "destructive",
        });
      } else {
        setTeamMembers(users.users);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error fetching team members",
        description: "Failed to load team members. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async () => {
    try {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail);
      if (error) {
        console.error('Error inviting member:', error);
        toast({
          title: "Error inviting member",
          description: `Failed to invite ${inviteEmail}. Please check the email address and try again.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Member invited",
          description: `Successfully invited ${inviteEmail} to the team.`,
        });
        setIsInviteDialogOpen(false);
        setInviteEmail('');
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: "Error inviting member",
        description: "Failed to invite member. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateApiKey = async () => {
    setIsApiKeyLoading(true);
    try {
      // Simulate API key generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const generatedKey = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(generatedKey);
      setIsApiKeyDialogOpen(true);
    } catch (error) {
      console.error('Error generating API key:', error);
      toast({
        title: "Error generating API key",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApiKeyLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    setIsApiKeyLoading(true);
    try {
      // Simulate API key regeneration
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newKey = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(newKey);
      setIsApiKeyRegenerated(true);
      toast({
        title: "API key regenerated",
        description: "Successfully regenerated the API key.",
      });
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast({
        title: "Error regenerating API key",
        description: "Failed to regenerate API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApiKeyLoading(false);
      setIsRegenerateDialogOpen(false);
    }
  };

  const handleRevokeApiKey = async () => {
    setIsApiKeyLoading(true);
    try {
      // Simulate API key revocation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setApiKey('');
      setIsApiKeyRevoked(true);
      toast({
        title: "API key revoked",
        description: "Successfully revoked the API key.",
      });
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: "Error revoking API key",
        description: "Failed to revoke API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApiKeyLoading(false);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsApiKeyCopied(true);
    toast({
      title: "API key copied",
      description: "API key copied to clipboard.",
    });
    setTimeout(() => setIsApiKeyCopied(false), 2000);
  };

  const handleRemoveMember = async () => {
    if (!selectedMemberId) return;
    try {
      const { error } = await supabase.auth.admin.deleteUser(selectedMemberId);
      if (error) {
        console.error('Error removing member:', error);
        toast({
          title: "Error removing member",
          description: "Failed to remove member. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Member removed",
          description: "Successfully removed member from the team.",
        });
        setIsRemoveDialogOpen(false);
        setSelectedMemberId(null);
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error removing member",
        description: "Failed to remove member. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tabs defaultValue="team" className="space-y-4">
      <TabsList>
        <TabsTrigger value="team"><Users className="mr-2 h-4 w-4" /> Team Members</TabsTrigger>
        <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Settings</TabsTrigger>
        <TabsTrigger value="billing"><CreditCard className="mr-2 h-4 w-4" /> Billing</TabsTrigger>
        <TabsTrigger value="api"><Key className="mr-2 h-4 w-4" /> API Keys</TabsTrigger>
      </TabsList>
      <TabsContent value="team" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your team members and their roles.</CardDescription>
              <Button variant="outline" size="sm" onClick={() => setIsInviteDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading team members...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={member.user_metadata?.avatar_url} />
                            <AvatarFallback>{member.user_metadata?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.user_metadata?.full_name || member.user_metadata?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedMemberId(member.id);
                              setIsRemoveDialogOpen(true);
                            }}>
                              <UserX className="mr-2 h-4 w-4" />
                              Remove Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Share className="mr-2 h-4 w-4" />
                              Share Profile
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
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Team Settings</CardTitle>
            <CardDescription>Configure your team settings.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input id="team-name" defaultValue="LangCorp AI" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="team-description">Team Description</Label>
                <Input id="team-description" defaultValue="AI Solutions for Everyone" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="block mb-2">Security Settings</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security.</p>
                  </div>
                  <Switch id="2fa" />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">IP Whitelisting</p>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses.</p>
                  </div>
                  <Switch id="ip-whitelisting" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your subscription and billing details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Current Plan</h3>
                  <p className="text-muted-foreground">Premium</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              <p className="text-muted-foreground mt-2">Next billing date: July 20, 2024</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Payment Method</h4>
              <div className="mt-2 flex items-center space-x-4">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <span>**** **** **** 1234</span>
                <Button variant="outline" size="sm">Update Payment Method</Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium">Billing History</h4>
              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>June 20, 2024</TableCell>
                    <TableCell>Subscription Payment</TableCell>
                    <TableCell>$99.00</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>May 20, 2024</TableCell>
                    <TableCell>Subscription Payment</TableCell>
                    <TableCell>$99.00</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="api">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for accessing our services.</CardDescription>
              <Button variant="outline" size="sm" onClick={handleGenerateApiKey} disabled={!!apiKey}>
                {isApiKeyLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Generate API Key
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {apiKey ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <h3 className="text-lg font-semibold">API Key</h3>
                    <p className="text-muted-foreground">Use this key to authenticate your requests.</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <Input
                        type="text"
                        value={apiKey}
                        readOnly
                        className="bg-gray-900 border-gray-700 cursor-not-allowed"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyApiKey}
                        disabled={isApiKeyCopied}
                      >
                        {isApiKeyCopied ? (
                          <>
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Clipboard className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Regenerate Key
                  </Button>
                  <Button variant="destructive" onClick={handleRevokeApiKey} disabled={isApiKeyLoading}>
                    {isApiKeyLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Revoking...
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        Revoke Key
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                No API key generated yet. Click "Generate API Key" to create one.
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800">
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to invite to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="col-span-3 bg-black/60 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Key Dialog */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800">
          <DialogHeader>
            <DialogTitle>Generated API Key</DialogTitle>
            <DialogDescription>
              Your API key has been generated. Please store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="api-key" className="text-right">
                API Key
              </Label>
              <Input
                type="text"
                id="api-key"
                value={apiKey}
                readOnly
                className="col-span-3 bg-gray-900 border-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleCopyApiKey} disabled={isApiKeyCopied}>
              {isApiKeyCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate API Key Dialog */}
      <Dialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800">
          <DialogHeader>
            <DialogTitle>Regenerate API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to regenerate your API key? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRegenerateApiKey} disabled={isApiKeyLoading}>
              {isApiKeyLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Regenerating...
                </>
              ) : (
                "Regenerate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from your team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default TeamManagement;
