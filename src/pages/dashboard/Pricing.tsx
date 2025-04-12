
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Check,
  X,
  CreditCard,
  Sparkles,
  Zap,
  Shield,
  Infinity,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  free: boolean;
  pro: boolean;
  enterprise: boolean;
}

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPlan } = useSubscription();
  const { toast } = useToast();

  const planFeatures: PlanFeature[] = [
    { name: 'AI Agents', free: true, pro: true, enterprise: true },
    { name: 'Knowledge Base', free: false, pro: true, enterprise: true },
    { name: 'Custom Prompts', free: true, pro: true, enterprise: true },
    { name: 'Vector Storage', free: false, pro: true, enterprise: true },
    { name: 'API Integrations', free: false, pro: true, enterprise: true },
    { name: 'Advanced AI Models', free: false, pro: true, enterprise: true },
    { name: 'Human-in-the-loop', free: false, pro: true, enterprise: true },
    { name: 'Team Collaboration', free: false, pro: true, enterprise: true },
    { name: 'Usage Analytics', free: false, pro: true, enterprise: true },
    { name: 'Priority Support', free: false, pro: false, enterprise: true },
    { name: 'Custom Agent Development', free: false, pro: false, enterprise: true },
    { name: 'SLA Guarantees', free: false, pro: false, enterprise: true },
  ];

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Subscription Updated',
        description: 'You have successfully subscribed to the selected plan',
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Failed',
        description: 'An error occurred while processing your subscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your needs. All plans include our core features.
          </p>
          
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center space-x-2 bg-black/30 border border-gray-800 p-1 rounded-lg">
              <Label
                htmlFor="billing-toggle"
                className={`px-3 py-1 rounded cursor-pointer ${
                  !isAnnual ? "bg-electric-blue/20 text-electric-blue" : ""
                }`}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-electric-blue"
              />
              <Label
                htmlFor="billing-toggle"
                className={`px-3 py-1 rounded cursor-pointer flex items-center ${
                  isAnnual ? "bg-electric-blue/20 text-electric-blue" : ""
                }`}
              >
                Annual
                <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-400 border-0">
                  Save 20%
                </Badge>
              </Label>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm relative overflow-hidden">
            {currentPlan?.name === 'Free' && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg bg-electric-blue">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 text-gray-400 mr-2" />
                <CardTitle>Free</CardTitle>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-sm text-muted-foreground ml-1">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Basic features for individuals to try out the platform
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Plan Limits</h4>
                <div className="flex justify-between text-sm">
                  <span>AI Agents</span>
                  <span className="font-medium">2 agents</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Queries / Month</span>
                  <span className="font-medium">100 queries</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span className="font-medium">10 MB</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <ul className="space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      {feature.free ? (
                        <Check className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      )}
                      <span className={!feature.free ? "text-gray-500" : ""}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={currentPlan?.name === 'Free' || isLoading}
                onClick={() => handleSubscribe('free')}
              >
                {currentPlan?.name === 'Free' ? 'Current Plan' : 'Get Started'}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-electric-blue bg-black/30 backdrop-blur-sm relative overflow-hidden shadow-lg shadow-electric-blue/10">
            {currentPlan?.name === 'Pro' && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg bg-electric-blue">Current Plan</Badge>
              </div>
            )}
            <div className="absolute -top-6 -right-6">
              <div className="relative transform rotate-45">
                <Badge className="rounded-none px-8 py-1 bg-gradient-to-r from-electric-blue to-cyberpunk-purple border-0">
                  POPULAR
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 text-electric-blue mr-2" />
                <CardTitle>Pro</CardTitle>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${isAnnual ? 39 : 49}</span>
                <span className="text-sm text-muted-foreground ml-1">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isAnnual && <span className="text-sm text-electric-blue font-medium">$468 billed annually (save $120)</span>}
                {!isAnnual && <span>Advanced features for professionals and small teams</span>}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Plan Limits</h4>
                <div className="flex justify-between text-sm">
                  <span>AI Agents</span>
                  <span className="font-medium">10 agents</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Queries / Month</span>
                  <span className="font-medium">1,000 queries</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span className="font-medium">1 GB</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <ul className="space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      {feature.pro ? (
                        <Check className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      )}
                      <span className={!feature.pro ? "text-gray-500" : ""}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-electric-blue to-cyberpunk-purple"
                disabled={currentPlan?.name === 'Pro' || isLoading}
                onClick={() => handleSubscribe('pro')}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : currentPlan?.name === 'Pro' ? (
                  'Current Plan'
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm relative overflow-hidden">
            {currentPlan?.name === 'Enterprise' && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg bg-electric-blue">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-cyberpunk-purple mr-2" />
                <CardTitle>Enterprise</CardTitle>
              </div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${isAnnual ? 249 : 299}</span>
                <span className="text-sm text-muted-foreground ml-1">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isAnnual && <span className="text-sm text-cyberpunk-purple font-medium">$2,988 billed annually (save $600)</span>}
                {!isAnnual && <span>Advanced features for large organizations</span>}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Plan Limits</h4>
                <div className="flex justify-between text-sm">
                  <span>AI Agents</span>
                  <span className="font-medium">100 agents</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Queries / Month</span>
                  <span className="font-medium">10,000 queries</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage</span>
                  <span className="font-medium">10 GB</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <ul className="space-y-2">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      {feature.enterprise ? (
                        <Check className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      )}
                      <span className={!feature.enterprise ? "text-gray-500" : ""}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={currentPlan?.name === 'Enterprise' || isLoading}
                onClick={() => handleSubscribe('enterprise')}
              >
                {currentPlan?.name === 'Enterprise' ? 'Current Plan' : 'Contact Sales'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-black/40 border border-gray-800 rounded-lg max-w-3xl mx-auto">
          <h3 className="text-xl font-medium mb-4 flex items-center">
            <Infinity className="mr-2 h-5 w-5 text-electric-blue" />
            Need a Custom Plan?
          </h3>
          <p className="text-muted-foreground mb-6">
            For organizations with specific requirements, we offer custom plans with tailored features, dedicated support, and flexible pricing options.
          </p>
          <Button className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple">
            Contact Our Sales Team
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
