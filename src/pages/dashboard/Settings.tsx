
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  CreditCard,
  Key,
  EyeIcon,
  EyeOffIcon,
  Save,
  LogOut,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/context/AuthContext';

// Industries options for dropdown
const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Entertainment',
  'Consulting',
  'Government',
  'Other'
];

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    first_name: '',
    last_name: '',
    company_name: '',
    industry: '',
    company_size: 1,
    role: '',
    phone: '',
    discovery_source: ''
  });
  
  // Password change states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.user_metadata) {
          const metadata = userData.user.user_metadata;
          setUserData({
            first_name: metadata.first_name || '',
            last_name: metadata.last_name || '',
            company_name: metadata.company_name || '',
            industry: metadata.industry || '',
            company_size: metadata.company_size || 1,
            role: metadata.role || '',
            phone: metadata.phone || '',
            discovery_source: metadata.discovery_source || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);

  // Update user data
  const handleUserDataChange = (field: keyof UserData, value: string | number) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    // Reset errors
    setPasswordErrors({});
    
    // Validate
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    else if (newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      // Clear inputs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Save notification preferences
  const handleSaveNotificationPreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-heading text-white flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-electric-blue" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </header>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-black/30 border border-gray-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-electric-blue/10">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-electric-blue/10">
              <Shield className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-electric-blue/10">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-electric-blue/10">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile tab */}
          <TabsContent value="profile">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal and company information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={userData.first_name}
                        onChange={(e) => handleUserDataChange('first_name', e.target.value)}
                        className="bg-black/40 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={userData.last_name}
                        onChange={(e) => handleUserDataChange('last_name', e.target.value)}
                        className="bg-black/40 border-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-black/40 border-gray-700 opacity-70"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userData.phone || ''}
                      onChange={(e) => handleUserDataChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="bg-black/40 border-gray-700"
                    />
                  </div>
                </div>

                <Separator className="my-6 bg-gray-800" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Company Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={userData.company_name}
                      onChange={(e) => handleUserDataChange('company_name', e.target.value)}
                      className="bg-black/40 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role</Label>
                    <Input
                      id="role"
                      value={userData.role || ''}
                      onChange={(e) => handleUserDataChange('role', e.target.value)}
                      placeholder="e.g. CTO, Marketing Manager"
                      className="bg-black/40 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={userData.industry} 
                      onValueChange={(value) => handleUserDataChange('industry', value)}
                    >
                      <SelectTrigger className="bg-black/40 border-gray-700">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="companySize">Company Size</Label>
                      <span className="text-sm text-muted-foreground">
                        {userData.company_size} {userData.company_size === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                    <Slider
                      id="companySize"
                      min={1}
                      max={1000}
                      step={1}
                      value={[userData.company_size]}
                      onValueChange={(value) => handleUserDataChange('company_size', value[0])}
                      className="py-4"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-gray-800 pt-4">
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={loading}
                  className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Account tab */}
          <TabsContent value="account">
            <div className="grid gap-8 grid-cols-1">
              {/* Password Change */}
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5 text-electric-blue" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-black/40 border-gray-700 pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-black/40 border-gray-700 pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-black/40 border-gray-700 pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                    )}
                    {newPassword && confirmPassword && (
                      <div className="flex items-center text-xs mt-1">
                        {newPassword === confirmPassword ? (
                          <>
                            <CheckCircle size={14} className="text-emerald-500 mr-2" />
                            <span className="text-emerald-500">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} className="text-red-500 mr-2" />
                            <span className="text-red-500">Passwords do not match</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-800 pt-4">
                  <Button 
                    onClick={handleChangePassword} 
                    disabled={passwordLoading}
                    className="bg-electric-blue hover:bg-electric-blue/90"
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Account Management */}
              <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-cyberpunk-purple" />
                    Account Management
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and authentication options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Two-Factor Authentication</h4>
                      <p className="text-xs text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                      Coming Soon
                    </Badge>
                  </div>
                  
                  <Separator className="bg-gray-800" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Session Management</h4>
                      <p className="text-xs text-muted-foreground">
                        Manage and terminate active sessions
                      </p>
                    </div>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                      Coming Soon
                    </Badge>
                  </div>
                  
                  <Separator className="bg-gray-800" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Account Status</h4>
                      <p className="text-xs text-muted-foreground">
                        Your account is active and in good standing
                      </p>
                    </div>
                    <Badge className="bg-emerald-500 hover:bg-emerald-500">
                      Active
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col md:flex-row justify-between gap-4 border-t border-gray-800 pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto hover:bg-red-500/10 hover:text-red-500 border-red-500/30 text-red-500"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto hover:bg-red-500/10 hover:text-red-500 border-red-500/30 text-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications tab */}
          <TabsContent value="notifications">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-holographic-teal" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                      className="data-[state=checked]:bg-electric-blue"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-sm font-medium">Marketing Emails</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive emails about new features and offers
                      </p>
                    </div>
                    <Switch 
                      checked={marketingEmails} 
                      onCheckedChange={setMarketingEmails}
                      className="data-[state=checked]:bg-electric-blue"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-sm font-medium">Product Updates</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications about product updates and changes
                      </p>
                    </div>
                    <Switch 
                      checked={productUpdates} 
                      onCheckedChange={setProductUpdates}
                      className="data-[state=checked]:bg-electric-blue"
                    />
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">In-App Notifications</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-sm font-medium">Agent Activity</h4>
                      <p className="text-xs text-muted-foreground">
                        Notifications about your agent activities
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-electric-blue" />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-sm font-medium">System Alerts</h4>
                      <p className="text-xs text-muted-foreground">
                        Important system alerts and announcements
                      </p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-electric-blue" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <Button 
                  onClick={handleSaveNotificationPreferences}
                  className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple"
                >
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing tab */}
          <TabsContent value="billing">
            <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-cyber-purple" />
                  Subscription & Billing
                </CardTitle>
                <CardDescription>
                  Manage your subscription plan and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-electric-blue/10 to-cyberpunk-purple/10 rounded-lg border border-electric-blue/20 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <Badge className="bg-electric-blue hover:bg-electric-blue mb-2">Current Plan</Badge>
                      <h3 className="text-2xl font-heading text-white mb-1">Free Trial</h3>
                      <p className="text-sm text-muted-foreground">
                        Basic features with limited usage
                      </p>
                    </div>
                    <Button className="bg-cyberpunk-purple hover:bg-cyberpunk-purple/90 shadow-neon-purple">
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Payment Methods</h3>
                  <div className="p-6 border border-gray-800 rounded-lg flex items-center justify-center text-muted-foreground">
                    No payment methods added yet
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
                
                <Separator className="bg-gray-800" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Billing History</h3>
                  <div className="p-6 border border-gray-800 rounded-lg flex items-center justify-center text-muted-foreground">
                    No billing history available
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
