
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserData } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle, XCircle, Lock, Shield, Fingerprint, EyeIcon, EyeOffIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import { Progress } from '@/components/ui/progress';

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

// Initial user data state
const initialUserData: UserData = {
  first_name: '',
  last_name: '',
  company_name: '',
  industry: '',
  company_size: 1,
  role: '',
  phone: '',
  discovery_source: '',
};

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Get tab from URL if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Validate password and check strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      });
      return;
    }

    // Check individual validations
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    setPasswordValidation(validations);
    
    // Calculate strength based on validations
    const strength = Object.values(validations).filter(Boolean).length * 20;
    setPasswordStrength(strength);
  }, [password]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (activeTab === 'signup') {
      if (!userData.first_name) newErrors.first_name = 'First name is required';
      if (!userData.last_name) newErrors.last_name = 'Last name is required';
      if (!userData.company_name) newErrors.company_name = 'Company name is required';
      if (!userData.industry) newErrors.industry = 'Industry is required';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!termsAccepted) newErrors.terms = 'You must accept the terms and conditions';
      
      // Password strength validation
      if (passwordStrength < 60) {
        newErrors.password = 'Password is not strong enough. Please follow the requirements below.';
      }
    }
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    await signUp(email, password, userData);
    setIsLoading(false);
  };

  // Update user data
  const handleUserDataChange = (field: keyof UserData, value: string | number) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  // Password strength color
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-raiden-black flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md relative z-10">
        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="text-2xl font-heading text-white mt-4">Raiden Agents</h1>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-electric-blue/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyberpunk-purple/10 rounded-full blur-2xl"></div>
        
        <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 bg-black/50 backdrop-blur-sm border border-gray-800">
            <TabsTrigger value="signin" className="data-[state=active]:bg-electric-blue/10 data-[state=active]:text-white data-[state=active]:shadow-none">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-cyberpunk-purple/10 data-[state=active]:text-white data-[state=active]:shadow-none">
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          {/* Sign In */}
          <TabsContent value="signin">
            <Card className="border-gray-800 bg-black/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-cyberpunk-purple">Sign in to Raiden Agents</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <a href="#" className="text-xs text-electric-blue hover:text-white transition-colors">Forgot password?</a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black/40 border-gray-700 text-white pr-10 focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      className="data-[state=checked]:bg-electric-blue"
                    />
                    <Label htmlFor="remember-me" className="text-gray-300 text-sm">Remember me</Label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-electric-blue to-cyberpunk-purple hover:from-electric-blue/90 hover:to-cyberpunk-purple/90 text-white font-heading transition-all duration-300 shadow-neon-blue"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
                <div className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <Button variant="link" className="p-0 text-electric-blue hover:text-white" onClick={() => setActiveTab('signup')}>
                    Sign up now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Sign Up */}
          <TabsContent value="signup">
            <Card className="border-gray-800 bg-black/50 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyberpunk-purple to-electric-blue">Create your account</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your details to create your Raiden Agents account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <Input
                          id="firstName"
                          value={userData.first_name}
                          onChange={(e) => handleUserDataChange('first_name', e.target.value)}
                          className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                        />
                        {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <Input
                          id="lastName"
                          value={userData.last_name}
                          onChange={(e) => handleUserDataChange('last_name', e.target.value)}
                          className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                        />
                        {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-black/40 border-gray-700 text-white pr-10 focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                      
                      {/* Password strength indicator */}
                      {password && (
                        <div className="mt-3 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Password strength:</span>
                            <span className={`
                              ${passwordStrength < 40 ? 'text-red-500' : ''}
                              ${passwordStrength >= 40 && passwordStrength < 80 ? 'text-yellow-500' : ''}
                              ${passwordStrength >= 80 ? 'text-emerald-500' : ''}
                            `}>
                              {getStrengthText()}
                            </span>
                          </div>
                          <Progress value={passwordStrength} className="h-1 bg-gray-700" indicatorClassName={getStrengthColor()} />
                          
                          {/* Password requirements */}
                          <div className="space-y-1 mt-2">
                            <div className="flex items-center text-xs">
                              {passwordValidation.length ? (
                                <CheckCircle size={14} className="text-emerald-500 mr-2" />
                              ) : (
                                <XCircle size={14} className="text-red-500 mr-2" />
                              )}
                              <span className={passwordValidation.length ? "text-emerald-500" : "text-gray-400"}>
                                At least 8 characters
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              {passwordValidation.uppercase ? (
                                <CheckCircle size={14} className="text-emerald-500 mr-2" />
                              ) : (
                                <XCircle size={14} className="text-red-500 mr-2" />
                              )}
                              <span className={passwordValidation.uppercase ? "text-emerald-500" : "text-gray-400"}>
                                At least one uppercase letter
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              {passwordValidation.lowercase ? (
                                <CheckCircle size={14} className="text-emerald-500 mr-2" />
                              ) : (
                                <XCircle size={14} className="text-red-500 mr-2" />
                              )}
                              <span className={passwordValidation.lowercase ? "text-emerald-500" : "text-gray-400"}>
                                At least one lowercase letter
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              {passwordValidation.number ? (
                                <CheckCircle size={14} className="text-emerald-500 mr-2" />
                              ) : (
                                <XCircle size={14} className="text-red-500 mr-2" />
                              )}
                              <span className={passwordValidation.number ? "text-emerald-500" : "text-gray-400"}>
                                At least one number
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              {passwordValidation.special ? (
                                <CheckCircle size={14} className="text-emerald-500 mr-2" />
                              ) : (
                                <XCircle size={14} className="text-red-500 mr-2" />
                              )}
                              <span className={passwordValidation.special ? "text-emerald-500" : "text-gray-400"}>
                                At least one special character
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`bg-black/40 border-gray-700 text-white pr-10 focus:border-electric-blue focus:ring-1 focus:ring-electric-blue ${
                            password && confirmPassword && password !== confirmPassword ? 'border-red-500' : ''
                          }`}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                      {password && confirmPassword && (
                        <div className="flex items-center text-xs mt-1">
                          {password === confirmPassword ? (
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
                  </div>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Company Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-white">Company Name</Label>
                      <Input
                        id="companyName"
                        value={userData.company_name}
                        onChange={(e) => handleUserDataChange('company_name', e.target.value)}
                        className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                      />
                      {errors.company_name && <p className="text-red-500 text-xs">{errors.company_name}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-white">Industry</Label>
                      <Select 
                        value={userData.industry} 
                        onValueChange={(value) => handleUserDataChange('industry', value)}
                      >
                        <SelectTrigger className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industry && <p className="text-red-500 text-xs">{errors.industry}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="companySize" className="text-white">Company Size</Label>
                        <span className="text-sm text-gray-400">{userData.company_size} {userData.company_size === 1 ? 'person' : 'people'}</span>
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-white">Your Role (Optional)</Label>
                      <Input
                        id="role"
                        value={userData.role || ''}
                        onChange={(e) => handleUserDataChange('role', e.target.value)}
                        className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                        placeholder="e.g. CTO, Marketing Manager"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={userData.phone || ''}
                        onChange={(e) => handleUserDataChange('phone', e.target.value)}
                        className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discoverySource" className="text-white">How did you hear about us? (Optional)</Label>
                      <Input
                        id="discoverySource"
                        value={userData.discovery_source || ''}
                        onChange={(e) => handleUserDataChange('discovery_source', e.target.value)}
                        className="bg-black/40 border-gray-700 text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue"
                        placeholder="e.g. Google, Friend, Conference"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 pt-2">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-700 bg-black/40 text-electric-blue focus:ring-electric-blue focus:ring-offset-gray-900"
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      <label htmlFor="terms">
                        I agree to the{" "}
                        <a href="#" className="text-electric-blue hover:text-white">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-electric-blue hover:text-white">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                  {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyberpunk-purple to-electric-blue hover:from-cyberpunk-purple/90 hover:to-electric-blue/90 text-white font-heading transition-all duration-300 shadow-neon-purple"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
                <div className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <Button variant="link" className="p-0 text-electric-blue hover:text-white" onClick={() => setActiveTab('signin')}>
                    Sign in
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Security Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-black/40 p-3 rounded-full border border-gray-800 mb-2">
              <Lock className="h-5 w-5 text-electric-blue" />
            </div>
            <span className="text-xs text-gray-400">End-to-End Encryption</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-black/40 p-3 rounded-full border border-gray-800 mb-2">
              <Shield className="h-5 w-5 text-holographic-teal" />
            </div>
            <span className="text-xs text-gray-400">Advanced Security</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-black/40 p-3 rounded-full border border-gray-800 mb-2">
              <Fingerprint className="h-5 w-5 text-cyberpunk-purple" />
            </div>
            <span className="text-xs text-gray-400">Biometric Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
