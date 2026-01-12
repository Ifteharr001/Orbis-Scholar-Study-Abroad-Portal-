"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MoreHorizontal, Mail, Shield, Users, UserPlus, Crown, Edit, Trash2, Send, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  avatar?: string;
  lastActive: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  sentAt: string;
  expiresAt: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Ahmed Rahman", email: "ahmed@educonsult.com", role: "Owner", status: "active", lastActive: "Just now" },
  { id: "2", name: "Fatima Khan", email: "fatima@educonsult.com", role: "Admin", status: "active", lastActive: "2 hours ago" },
  { id: "3", name: "Mohammad Ali", email: "ali@educonsult.com", role: "Counselor", status: "active", lastActive: "1 day ago" },
  { id: "4", name: "Sarah Begum", email: "sarah@educonsult.com", role: "Counselor", status: "active", lastActive: "3 hours ago" },
  { id: "5", name: "Karim Hassan", email: "karim@educonsult.com", role: "Staff", status: "inactive", lastActive: "1 week ago" },
];

const mockInvitations: Invitation[] = [
  { id: "1", email: "newcounselor@gmail.com", role: "Counselor", status: "pending", sentAt: "2024-01-15", expiresAt: "2024-01-22" },
  { id: "2", email: "admin2@educonsult.com", role: "Admin", status: "expired", sentAt: "2024-01-01", expiresAt: "2024-01-08" },
];

const roles = [
  { name: "Owner", description: "Full access to all features and settings", color: "bg-yellow-500" },
  { name: "Admin", description: "Manage users, settings, and all operations", color: "bg-red-500" },
  { name: "Counselor", description: "Manage assigned students and applications", color: "bg-blue-500" },
  { name: "Staff", description: "Limited access to view and update data", color: "bg-green-500" },
];

const UsersRolesPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Counselor");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendInvite = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }
    
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      sentAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
    
    setInvitations([newInvitation, ...invitations]);
    setInviteEmail("");
    setInviteDialogOpen(false);
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleResendInvite = (invitation: Invitation) => {
    toast.success(`Invitation resent to ${invitation.email}`);
  };

  const handleRevokeInvite = (invitationId: string) => {
    setInvitations(invitations.filter((i) => i.id !== invitationId));
    toast.success("Invitation revoked");
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    toast.success("User removed successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "accepted":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Accepted</Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant="outline" className="gap-1">
        {role === "Owner" && <Crown className="h-3 w-3 text-yellow-500" />}
        {role === "Admin" && <Shield className="h-3 w-3 text-red-500" />}
        {role}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users & Roles</h1>
          <p className="text-muted-foreground">Manage team members and their permissions</p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an email invitation to add a new team member
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    className="pl-9"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Counselor">Counselor</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {roles.find((r) => r.name === inviteRole)?.description}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendInvite}>
                <Send className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-500/10">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invitations.filter((i) => i.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{roles.length}</p>
                <p className="text-sm text-muted-foreground">Role Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your organization team members</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={user.role === "Owner"}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRemoveUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Manage sent invitations and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending invitations</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">{invitation.email}</TableCell>
                        <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                        <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{invitation.sentAt}</TableCell>
                        <TableCell className="text-muted-foreground">{invitation.expiresAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleResendInvite(invitation)}
                              disabled={invitation.status === "accepted"}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRevokeInvite(invitation.id)}
                              disabled={invitation.status === "accepted"}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${role.color}`} />
                      {role.name}
                    </CardTitle>
                    {role.name !== "Owner" && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Permissions</p>
                    <div className="space-y-2">
                      {role.name === "Owner" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Full system access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Manage billing & subscription</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Delete organization</span>
                          </div>
                        </>
                      )}
                      {role.name === "Admin" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Manage users & roles</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Access all students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Configure settings</span>
                          </div>
                        </>
                      )}
                      {role.name === "Counselor" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Manage assigned students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Create applications</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Upload documents</span>
                          </div>
                        </>
                      )}
                      {role.name === "Staff" && (
                        <>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">View student data</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox checked disabled />
                            <span className="text-sm">Update basic info</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox disabled />
                            <span className="text-sm text-muted-foreground">Delete records</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersRolesPage;