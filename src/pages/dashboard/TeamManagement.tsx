import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, UserPlus, User, Copy, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatarUrl?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

const mockTeam: Team = {
  id: 'team-1',
  name: 'Acme Corp',
  description: 'The A-team for everything',
  members: [
    {
      id: 'member-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      avatarUrl: 'https://github.com/shadcn.png'
    },
    {
      id: 'member-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'member',
      avatarUrl: 'https://avatars.githubusercontent.com/u/88843?v=4'
    },
    {
      id: 'member-3',
      name: 'Peter Jones',
      email: 'peter.jones@example.com',
      role: 'member',
      avatarUrl: 'https://ui.shadcn.com/icons/ অবতars/2.png'
    }
  ]
};

const TeamManagement: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team>(mockTeam);
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching team data from an API
    setTimeout(() => {
      setTeam(mockTeam);
    }, 500);
  }, []);

  const handleInviteMember = () => {
    if (!newMemberEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending an invitation
    console.log(`Inviting member with email: ${newMemberEmail}`);
    setNewMemberEmail('');

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newMemberEmail}`,
      // Change variant from "outline" to "default"
      variant: "default"
    });
  };

  const handleRoleChange = (member: TeamMember, newRole: 'admin' | 'member') => {
    const updatedMembers = team.members.map(m =>
      m.id === member.id ? { ...m, role: newRole } : m
    );
    setTeam({ ...team, members: updatedMembers });

    toast({
      title: "Team role updated",
      description: `${member.name}'s role has been updated to ${newRole}`,
      // Change variant from "outline" to "default"
      variant: "default"
    });
  };

  const handleRemoveMember = (memberToRemove: TeamMember) => {
    const updatedMembers = team.members.filter(m => m.id !== memberToRemove.id);
    setTeam({ ...team, members: updatedMembers });

    toast({
      title: "Team member removed",
      description: `${memberToRemove.name} has been removed from the team`,
      // Change variant from "outline" to "default"
      variant: "default"
    });
  };

  const handleDeleteTeam = (isLeaving: boolean) => {
    // Simulate deleting the team or leaving the team
    console.log(isLeaving ? `Leaving team ${team.name}` : `Deleting team ${team.name}`);
    navigate('/dashboard');

    // Fix the conditional variant
    const variant = isLeaving ? "destructive" : "default";

    toast({
      title: isLeaving ? "Leave team" : "Delete team",
      description: isLeaving 
        ? `You have left ${team.name}` 
        : `Team ${team.name} has been deleted`,
      variant
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="bg-black/20 border-gray-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            {team.name}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Team
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the team and all related data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteTeam(false)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardDescription className="px-4 pb-4">
          {team.description}
        </CardDescription>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="email">Invite new member</Label>
            <div className="flex-grow">
              <Input
                id="email"
                placeholder="Email address"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleInviteMember}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>

          <Table>
            <TableCaption>A list of your team members.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Select
                      value={member.role}
                      onValueChange={(value) => handleRoleChange(member, value as 'admin' | 'member')}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="mt-6">
            Leave Team
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-black/90 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              Leaving the team will remove you from all team resources and collaborations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteTeam(true)}>Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamManagement;
