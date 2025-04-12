
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, MessageSquare, BarChart3, BrainCircuit, 
  Workflow, Star, Server, Robot, Cog, Globe, Cpu, 
  Award, Briefcase, Code, Target, Users, Zap, Building 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Define service categories
const serviceCategories = [
  {
    id: "ai-agents",
    title: "AI Agents",
    description: "Intelligent autonomous systems that transform business operations",
    icon: BrainCircuit,
    color: "electric-blue"
  },
  {
    id: "enterprise-solutions",
    title: "Enterprise Solutions",
    description: "End-to-end implementation of AI systems at scale",
    icon: Building,
    color: "cyber-purple"
  },
  {
    id: "integration-services",
    title: "Integration Services",
    description: "Seamless connection with existing enterprise systems",
    icon: Cog,
    color: "holo-teal"
  },
  {
    id: "custom-development",
    title: "Custom Development",
    description: "Tailored solutions for unique business challenges",
    icon: Code,
    color: "electric-blue"
  }
];

// Define detailed services within each category
const detailedServices = {
  "ai-agents": [
    {
      title: "Customer Support Agents",
      description: "24/7 intelligent support with human-like communication capabilities, reducing response time and increasing customer satisfaction through personalized interactions.",
      icon: MessageSquare,
      benefits: ["24/7 availability", "Human-like conversations", "Personalized responses", "Multilingual support"]
    },
    {
      title: "Sales & Marketing Agents",
      description: "Conversion-optimized AI driving revenue growth through intelligent lead qualification, personalized outreach, and automated follow-ups.",
      icon: Star,
      benefits: ["Lead qualification", "Personalized outreach", "Campaign optimization", "Customer journey mapping"]
    },
    {
      title: "Operations Agents",
      description: "Streamline workflows with precision automation that handles routine tasks, exception management, and cross-department coordination.",
      icon: Workflow,
      benefits: ["Process automation", "Exception handling", "Workflow optimization", "Resource allocation"]
    },
    {
      title: "Data Analysis Agents",
      description: "Transform raw data into actionable insights with AI-powered analysis, pattern recognition, and predictive modeling.",
      icon: BarChart3,
      benefits: ["Pattern recognition", "Predictive analytics", "Report generation", "Decision support"]
    },
    {
      title: "Security Agents",
      description: "Proactive threat detection and mitigation with AI systems that learn and adapt to emerging security challenges.",
      icon: ShieldCheck,
      benefits: ["Threat detection", "Anomaly identification", "Access management", "Security response"]
    },
    {
      title: "Multi-Agent Systems",
      description: "Orchestrated teams of specialized AI agents working together to solve complex problems across organizational boundaries.",
      icon: Users,
      benefits: ["Cross-domain collaboration", "Specialized expertise", "Scalable intelligence", "Autonomous coordination"]
    }
  ],
  "enterprise-solutions": [
    {
      title: "Digital Transformation",
      description: "End-to-end enterprise AI implementation that modernizes operations, enhances customer experiences, and drives innovation.",
      icon: Zap,
      benefits: ["Process reimagining", "Legacy system evolution", "Data unification", "Future-proof architecture"]
    },
    {
      title: "Industry-Specific Solutions",
      description: "Tailored AI implementations for financial services, healthcare, manufacturing, retail, and other specialized industries.",
      icon: Briefcase,
      benefits: ["Regulatory compliance", "Industry best practices", "Specialized workflows", "Domain-specific models"]
    },
    {
      title: "Enterprise AI Platform",
      description: "Comprehensive AI infrastructure providing the foundation for intelligent operations across your organization.",
      icon: Server,
      benefits: ["Unified AI management", "Centralized governance", "Scalable architecture", "Cross-department integration"]
    },
    {
      title: "Process Automation Suite",
      description: "End-to-end automation of complex business processes with intelligent orchestration and human-in-the-loop capabilities.",
      icon: Cpu,
      benefits: ["Process discovery", "Intelligent workflow", "Exception handling", "Performance analytics"]
    }
  ],
  "integration-services": [
    {
      title: "ERP Integration",
      description: "Seamless connection between AI agents and enterprise resource planning systems to enhance operational intelligence.",
      icon: Cog,
      benefits: ["Data synchronization", "Real-time insights", "Process enhancement", "Cross-system optimization"]
    },
    {
      title: "CRM Enhancement",
      description: "Augment customer relationship management with AI-powered insights, predictions, and engagement capabilities.",
      icon: Users,
      benefits: ["Customer intelligence", "Next-best-action", "Relationship forecasting", "Sentiment analysis"]
    },
    {
      title: "Legacy System Modernization",
      description: "Bridge the gap between traditional systems and modern AI capabilities without disruptive replacements.",
      icon: Target,
      benefits: ["Non-disruptive implementation", "Data extraction", "Capability extension", "Gradual transformation"]
    },
    {
      title: "Global Integration Platform",
      description: "Connect diverse systems across global operations with a unified platform for AI-enhanced coordination.",
      icon: Globe,
      benefits: ["Cross-region synchronization", "Localized compliance", "Global standardization", "Multi-timezone operations"]
    }
  ],
  "custom-development": [
    {
      title: "Specialized Agent Development",
      description: "Custom-built AI agents designed specifically for your unique business challenges and opportunities.",
      icon: Robot,
      benefits: ["Problem-specific design", "Proprietary algorithms", "Custom interfaces", "Unique capabilities"]
    },
    {
      title: "Research-Based Innovation",
      description: "Cutting-edge AI development based on the latest advancements in machine learning, natural language processing, and computer vision.",
      icon: BrainCircuit,
      benefits: ["State-of-the-art models", "Breakthrough capabilities", "Research partnerships", "IP development"]
    },
    {
      title: "Performance Optimization",
      description: "Fine-tuning and enhancement of AI systems to achieve maximum efficiency, accuracy, and business impact.",
      icon: Target,
      benefits: ["Model optimization", "Speed improvements", "Resource efficiency", "Cost reduction"]
    },
    {
      title: "Award-Winning Solutions",
      description: "Industry-recognized implementation expertise that delivers exceptional results and competitive advantage.",
      icon: Award,
      benefits: ["Best-in-class methodologies", "Proven frameworks", "Excellence standards", "Measurable outcomes"]
    }
  ]
};

// Implementation stages for the enterprise journey
const implementationStages = [
  {
    number: "01",
    title: "Discovery & Assessment",
    description: "Comprehensive analysis of your business processes, challenges, and AI opportunities",
    timeframe: "2-4 weeks"
  },
  {
    number: "02",
    title: "Strategy & Planning",
    description: "Development of tailored AI roadmap with prioritized implementation timeline",
    timeframe: "3-6 weeks"
  },
  {
    number: "03",
    title: "Prototype Development",
    description: "Rapid creation of functional AI agent prototype for initial validation",
    timeframe: "4-8 weeks"
  },
  {
    number: "04",
    title: "Enterprise Integration",
    description: "Seamless connection with existing systems and data sources",
    timeframe: "6-12 weeks"
  },
  {
    number: "05",
    title: "Scaling & Optimization",
    description: "Expansion of AI capabilities across the organization with performance tuning",
    timeframe: "Ongoing"
  }
];

// Case study highlights
const caseStudyHighlights = [
  {
    company: "Global Financial Institution",
    focus: "Customer Service Transformation",
    results: [
      "85% reduction in query resolution time",
      "24/7 support availability",
      "$4.2M annual operational savings"
    ]
  },
  {
    company: "Manufacturing Leader",
    focus: "Supply Chain Intelligence",
    results: [
      "93% forecast accuracy improvement",
      "37% inventory reduction",
      "62% decrease in stockout events"
    ]
  },
  {
    company: "Healthcare Network",
    focus: "Patient Experience Enhancement",
    results: [
      "98% appointment scheduling accuracy",
      "4.8/5 patient satisfaction score",
      "76% reduction in administrative tasks"
    ]
  }
];

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("ai-agents");

  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 bg-neural-network bg-cover bg-center bg-no-repeat opacity-20 z-0"></div>
        <div className="absolute w-full h-full">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-electric-blue rounded-full opacity-5 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-cyberpunk-purple rounded-full opacity-5 blur-[100px] animate-pulse"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 cyber-text-glow shimmer-text">
              Enterprise Intelligence Solutions
            </h1>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              Our comprehensive suite of AI services designed to transform your business operations, 
              customer experience, and competitive advantage in the digital age.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/contact" className="cta-button">
                Schedule Consultation
              </Link>
              <Link to="/case-studies" className="bg-transparent border border-electric-blue text-electric-blue hover:bg-electric-blue/10 transition-colors duration-300 px-6 py-3 rounded-md">
                View Success Stories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Service Categories */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-hex-pattern bg-repeat opacity-5 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading mb-6">Service Categories</h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Comprehensive AI solutions designed for every aspect of your enterprise
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className={`glass-card p-6 cursor-pointer transition-all duration-300 ${activeCategory === category.id ? 'border-electric-blue shadow-electric-blue/20' : 'hover:border-white/30'}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className={`inline-block p-4 rounded-lg bg-${category.color}/10 mb-4`}>
                  <category.icon className={`h-6 w-6 text-${category.color}`} />
                </div>
                <h3 className="text-xl font-heading mb-2">{category.title}</h3>
                <p className="text-white/70 text-sm">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Detailed Services */}
      <section className="py-20 bg-raiden-black/50 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading mb-6 text-center">
              {serviceCategories.find(cat => cat.id === activeCategory)?.title} Solutions
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto text-center">
              {serviceCategories.find(cat => cat.id === activeCategory)?.description}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedServices[activeCategory].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-electric-blue hover:shadow-electric-blue/20 transition-all duration-300 h-full flex flex-col"
              >
                <div className="bg-electric-blue/10 p-4 rounded-lg inline-block mb-4">
                  <service.icon className="h-6 w-6 text-electric-blue" />
                </div>
                <h3 className="text-xl font-heading mb-3">{service.title}</h3>
                <p className="text-white/70 mb-6 flex-grow">{service.description}</p>
                
                <div className="border-t border-white/10 pt-4 mt-auto">
                  <h4 className="text-sm font-heading mb-2 text-electric-blue">Key Benefits</h4>
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-white/70 flex items-start">
                        <span className="text-electric-blue mr-1">•</span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Implementation Process */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-board bg-repeat opacity-5 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading mb-6">Implementation Journey</h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our structured approach ensures successful AI transformation with measurable outcomes
            </p>
          </motion.div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-electric-blue via-cyber-purple to-holo-teal transform md:-translate-x-1/2 z-0"></div>
            
            {implementationStages.map((stage, index) => (
              <motion.div 
                key={index}
                className="relative mb-16 last:mb-0 flex flex-col md:flex-row items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
              >
                {/* Stage number */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-electric-blue to-cyber-purple flex items-center justify-center z-10 mb-4 md:mb-0">
                  <span className="text-xl font-heading">{stage.number}</span>
                </div>
                
                {/* Content */}
                <div className="md:ml-8 flex-grow md:w-[calc(100%-3.5rem)]">
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-heading mb-2">{stage.title}</h3>
                    <p className="text-white/70 mb-3">{stage.description}</p>
                    <div className="inline-block px-3 py-1 rounded text-xs bg-cyber-purple/20 text-cyber-purple">
                      {stage.timeframe}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Case Study Highlights */}
      <section className="py-20 bg-raiden-black/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading mb-6">Success Stories</h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Real-world results from our enterprise implementations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {caseStudyHighlights.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-heading mb-2 cyber-text-glow">{study.company}</h3>
                <p className="text-cyber-purple mb-4">{study.focus}</p>
                
                <ul className="space-y-2">
                  {study.results.map((result, i) => (
                    <li key={i} className="text-white/80 flex items-start">
                      <span className="text-electric-blue mr-2">→</span> {result}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/case-studies" className="inline-flex items-center text-electric-blue hover:text-white transition-colors duration-300">
              <span>View All Case Studies</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-5 w-5">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-cyber-purple/10 z-0"></div>
        <div className="absolute w-full h-full">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-electric-blue rounded-full opacity-5 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-cyber-purple rounded-full opacity-5 blur-[100px] animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-10 max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-heading mb-6">Ready to Transform Your Enterprise?</h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Schedule a consultation with our AI experts to discover how Raiden Agents can revolutionize your business operations
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="cta-button">
                Book a Consultation
              </Link>
              <Link to="/technology" className="bg-transparent border border-electric-blue text-electric-blue hover:bg-electric-blue/10 transition-colors duration-300 px-6 py-3 rounded-md">
                Explore Our Technology
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Services;
