
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Cloud, Shield, Cpu, Zap, Network } from 'lucide-react';

interface TechSpec {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const techSpecs: TechSpec[] = [
  {
    id: 'processing',
    title: 'Neural Processing',
    description: 'Advanced neural networks with 500M+ parameters for human-like reasoning and problem-solving capabilities.',
    icon: Cpu
  },
  {
    id: 'cloud',
    title: 'Cloud Architecture',
    description: 'Distributed cloud infrastructure ensuring 99.99% uptime and seamless scalability across global regions.',
    icon: Cloud
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description: 'SOC 2 Type II compliant with end-to-end encryption and real-time threat monitoring systems.',
    icon: Shield
  },
  {
    id: 'data',
    title: 'Data Processing',
    description: 'Process and analyze terabytes of data in real-time with advanced pattern recognition algorithms.',
    icon: Database
  },
  {
    id: 'performance',
    title: 'Response Speed',
    description: 'Sub-100ms response times with parallel processing capabilities for enterprise-scale operations.',
    icon: Zap
  },
  {
    id: 'integration',
    title: 'Integration Hub',
    description: 'Connect with 200+ enterprise systems through our standardized API and custom connectors.',
    icon: Network
  }
];

const TechnologyShowcase = () => {
  const [activeSpec, setActiveSpec] = useState<string | null>(null);

  return (
    <section className="py-24 relative overflow-hidden bg-raiden-black">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="shimmer-text mb-4">Advanced Technology Platform</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Enterprise-grade infrastructure powering the next generation of AI agents
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12 mt-12">
          {/* 3D Visualization (placeholder for now) */}
          <div className="w-full lg:w-1/2 glass-panel p-6 h-[400px] flex items-center justify-center relative overflow-hidden animate-pulse-glow">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* This would be replaced with an actual 3D visualization */}
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 border-4 border-electric-blue/30 animate-rotate-slow"></div>
                <div className="absolute inset-4 border-4 border-cyber-purple/20 animate-rotate-slow" style={{ animationDirection: 'reverse' }}></div>
                <div className="absolute inset-8 border-4 border-holo-teal/10 animate-rotate-slow" style={{ animationDuration: '15s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-electric-blue/20 backdrop-blur-md animate-pulse"></div>
                </div>
                {activeSpec && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-raiden-black/80 backdrop-blur-md p-4 rounded-lg border border-electric-blue/30 w-56 animate-fade-in-up">
                    <h4 className="text-electric-blue font-heading text-sm mb-1">
                      {techSpecs.find(spec => spec.id === activeSpec)?.title}
                    </h4>
                    <p className="text-white/70 text-xs">
                      {techSpecs.find(spec => spec.id === activeSpec)?.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-white/50">Interactive 3D model</div>
          </div>
          
          {/* Tech Specs */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techSpecs.map((spec) => (
                <div 
                  key={spec.id}
                  className={`glass-card p-4 cursor-pointer transition-all duration-300 ${activeSpec === spec.id ? 'border-electric-blue shadow-neon-blue' : 'hover:border-electric-blue/30'}`}
                  onMouseEnter={() => setActiveSpec(spec.id)}
                  onMouseLeave={() => setActiveSpec(null)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-electric-blue/10 p-2 rounded-lg">
                      <spec.icon className="h-5 w-5 text-electric-blue" />
                    </div>
                    <div>
                      <h4 className="font-heading text-white mb-1">{spec.title}</h4>
                      <p className="text-white/60 text-sm">{spec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/technology" className="cta-button">
                Explore Full Technology Stack
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
