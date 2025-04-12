
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  BrainCircuit, 
  Bot, 
  Database, 
  Layers, 
  Network, 
  Wrench, 
  Users, 
  Shield 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'annual'>('monthly');

  // Handle subscription
  const handleSubscribe = (plan: string) => {
    // In a real implementation, this would redirect to a checkout page
    navigate('/auth?signup=true&plan=' + plan);
  };

  // Features list for each plan
  const plans = [
    {
      name: 'Free',
      description: 'For individuals and small projects',
      monthlyPrice: 0,
      annualPrice: 0,
      highlight: false,
      features: [
        { name: 'Up to 2 agents', included: true },
        { name: '1,000 messages per month', included: true },
        { name: 'Basic templates', included: true },
        { name: 'Community support', included: true },
        { name: 'Vector store (100MB)', included: true },
        { name: 'Basic integrations', included: true },
        { name: 'Priority support', included: false },
        { name: 'Custom tools', included: false },
        { name: 'Team collaboration', included: false },
        { name: 'White-labeling', included: false },
      ],
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      description: 'For professionals and growing businesses',
      monthlyPrice: 29,
      annualPrice: 24,
      highlight: true,
      features: [
        { name: 'Up to 10 agents', included: true },
        { name: '10,000 messages per month', included: true },
        { name: 'All templates', included: true },
        { name: 'Priority support', included: true },
        { name: 'Vector store (1GB)', included: true },
        { name: 'Advanced integrations', included: true },
        { name: 'Custom tools (5)', included: true },
        { name: 'Team collaboration', included: true },
        { name: 'White-labeling', included: false },
        { name: 'Enterprise security', included: false },
      ],
      cta: 'Upgrade Now'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      monthlyPrice: 99,
      annualPrice: 84,
      highlight: false,
      features: [
        { name: 'Unlimited agents', included: true },
        { name: 'Unlimited messages', included: true },
        { name: 'All templates + custom', included: true },
        { name: 'Priority 24/7 support', included: true },
        { name: 'Vector store (10GB)', included: true },
        { name: 'All integrations + custom', included: true },
        { name: 'Unlimited custom tools', included: true },
        { name: 'Advanced team collaboration', included: true },
        { name: 'White-labeling', included: true },
        { name: 'Enterprise security', included: true },
      ],
      cta: 'Contact Sales'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div 
        className="absolute inset-0 bg-[url(/neural-network.svg)] bg-no-repeat bg-cover opacity-10 pointer-events-none"
        style={{ backgroundPosition: 'center 20%' }}
      />
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-full mb-4">
            <BrainCircuit className="w-5 h-5 text-electric-blue mr-2" />
            <span className="text-gray-300">Transparent, predictable pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Choose Your <span className="text-gradient">AI Agent</span> Plan</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Scale your AI capabilities with our flexible pricing options. 
            Pay only for what you need, with no hidden costs.
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <Tabs 
            defaultValue="monthly" 
            value={billingPeriod} 
            onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'annual')}
            className="w-full max-w-md"
          >
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-1">
              <TabsList className="grid grid-cols-2 w-full bg-transparent">
                <TabsTrigger 
                  value="monthly" 
                  className="data-[state=active]:bg-electric-blue/20 data-[state=active]:text-electric-blue data-[state=active]:shadow-none rounded-md"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger 
                  value="annual" 
                  className="data-[state=active]:bg-electric-blue/20 data-[state=active]:text-electric-blue data-[state=active]:shadow-none rounded-md"
                >
                  Annual <Badge className="ml-2 bg-electric-blue/20 text-electric-blue border-0">Save 15%</Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`border-gray-800 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all ${
                plan.highlight ? 'border-electric-blue/50 shadow-neon-blue' : ''
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <p className="text-gray-400">{plan.description}</p>
                  </div>
                  {plan.highlight && (
                    <Badge className="bg-electric-blue">Popular</Badge>
                  )}
                </div>
                <div className="mt-6">
                  <span className="text-4xl font-bold">
                    ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  <span className="text-gray-400 ml-1">/month</span>
                  {billingPeriod === 'annual' && plan.monthlyPrice > 0 && (
                    <p className="text-sm text-gray-500 mt-1">Billed annually (${plan.annualPrice * 12}/year)</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-200' : 'text-gray-500'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSubscribe(plan.name.toLowerCase())}
                  className={`w-full ${
                    plan.highlight 
                      ? 'bg-gradient-to-r from-electric-blue to-cyberpunk-purple hover:from-electric-blue/90 hover:to-cyberpunk-purple/90'
                      : 'bg-black/40 hover:bg-black/60 border border-gray-700'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Features Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-heading mb-12">Everything You Need to Build <span className="text-gradient">Advanced AI Agents</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all">
              <Bot className="h-10 w-10 text-electric-blue mb-4" />
              <h3 className="text-xl font-medium mb-2">Agent Templates</h3>
              <p className="text-gray-400">Pre-built agent templates for various industries and use cases to help you get started quickly.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all">
              <Database className="h-10 w-10 text-cyberpunk-purple mb-4" />
              <h3 className="text-xl font-medium mb-2">Vector Store</h3>
              <p className="text-gray-400">Connect your knowledge base and company documents for semantic search and retrieval.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all">
              <Layers className="h-10 w-10 text-holographic-teal mb-4" />
              <h3 className="text-xl font-medium mb-2">Graph Builder</h3>
              <p className="text-gray-400">Visual workflow builder for creating complex agent behaviors and decision paths.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all">
              <Wrench className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Tool Integration</h3>
              <p className="text-gray-400">Connect your agents to external APIs, databases, and services to extend capabilities.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all">
              <Network className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Deployment Options</h3>
              <p className="text-gray-400">Deploy agents via API, embed on your website, or integrate with messaging platforms.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all">
              <Shield className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Security & Compliance</h3>
              <p className="text-gray-400">Enterprise-grade security with data encryption, access controls, and audit logs.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all">
              <Users className="h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Team Collaboration</h3>
              <p className="text-gray-400">Collaborate with team members on agent development, testing, and deployment.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:border-gray-700 transition-all">
              <BrainCircuit className="h-10 w-10 text-electric-blue mb-4" />
              <h3 className="text-xl font-medium mb-2">Analytics & Insights</h3>
              <p className="text-gray-400">Track agent performance, conversation flows, and user engagement metrics.</p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 text-center mb-16">
          <h2 className="text-3xl font-heading mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-400">Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-2">How do you count messages?</h3>
              <p className="text-gray-400">A message is counted each time your agent receives input from a user or sends a response. System messages and function calls are not counted towards your limit.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-2">What happens if I exceed my message limit?</h3>
              <p className="text-gray-400">If you exceed your monthly message limit, you'll be charged an additional $0.005 per message. You can set usage alerts to help manage your costs.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-2">Do you offer refunds?</h3>
              <p className="text-gray-400">We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 14 days of your purchase for a full refund.</p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-black/70 to-black/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url(/circuit-board.svg)] bg-cover opacity-20" />
            
            <h2 className="text-3xl md:text-4xl font-heading mb-4 relative z-10">Ready to Build Intelligent AI Agents?</h2>
            <p className="text-xl text-gray-400 mb-8 relative z-10">
              Start for free, no credit card required. Upgrade as you grow.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button 
                onClick={() => navigate('/auth?signup=true')}
                className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple hover:from-electric-blue/90 hover:to-cyberpunk-purple/90 text-lg px-8 py-6 h-auto"
              >
                Get Started for Free
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/contact')}
                className="border-gray-700 hover:bg-black/40 text-lg px-8 py-6 h-auto"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
