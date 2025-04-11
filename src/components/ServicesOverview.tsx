
import React from 'react';
import { ShieldCheck, MessageSquare, BarChart3, BrainCircuit, Workflow, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: "Customer Support Agents",
    description: "24/7 intelligent support with human-like communication",
    icon: MessageSquare,
    color: "electric-blue"
  },
  {
    id: 2,
    title: "Sales & Marketing Agents",
    description: "Conversion-optimized AI driving revenue growth",
    icon: Star,
    color: "cyber-purple"
  },
  {
    id: 3,
    title: "Operations Agents",
    description: "Streamline workflows with precision automation",
    icon: Workflow,
    color: "holo-teal"
  },
  {
    id: 4,
    title: "Data Analysis Agents",
    description: "Transform raw data into actionable insights",
    icon: BarChart3,
    color: "electric-blue"
  },
  {
    id: 5,
    title: "Security Agents",
    description: "Proactive threat detection and mitigation",
    icon: ShieldCheck,
    color: "cyber-purple"
  },
  {
    id: 6,
    title: "Custom AI Solutions",
    description: "Purpose-built agents for unique business needs",
    icon: BrainCircuit,
    color: "holo-teal"
  }
];

const ServicesOverview = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="shimmer-text mb-4">AI Agents Ecosystem</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Intelligent solutions that adapt to your business requirements and scale with your growth
          </p>
        </div>
        
        <div className="hex-grid">
          {services.map((service) => (
            <Link 
              to="/services" 
              key={service.id} 
              className="group relative overflow-hidden"
            >
              <div className="hexagon p-6 flex flex-col items-center justify-center text-center h-full">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-${service.color}/10 group-hover:bg-${service.color}/20 transition-colors duration-300`}>
                  <service.icon className={`h-8 w-8 text-${service.color}`} />
                </div>
                <h3 className="text-xl font-heading mb-2">{service.title}</h3>
                <p className="text-white/70 text-sm">{service.description}</p>
                
                {/* Neon lines effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-electric-blue to-transparent"></div>
                  <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Link to="/services" className="inline-flex items-center text-electric-blue hover:text-white transition-colors duration-300">
            <span>Explore All AI Agent Solutions</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default ServicesOverview;
