
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const valuePropositions = [
  "Automate with Intelligence",
  "Scale with Confidence",
  "Transform with AI"
];

const Hero = () => {
  const [currentProposition, setCurrentProposition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProposition((prev) => (prev + 1) % valuePropositions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-raiden-black bg-opacity-90 z-0">
        <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20"></div>
        <div className="absolute w-full h-full">
          {/* Circuit lines animation will go here with more advanced implementation */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-electric-blue rounded-full opacity-5 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-cyber-purple rounded-full opacity-5 blur-[100px] animate-pulse"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="mb-6 cyber-text-glow font-heading animate-fade-in-up [animation-delay:200ms]">
            Next-Generation AI Agents for Enterprise Solutions
          </h1>
          
          <div className="h-10 mb-8 overflow-hidden relative">
            <div className="transition-transform duration-500 ease-in-out" style={{
              transform: `translateY(-${currentProposition * 2.5}rem)`
            }}>
              {valuePropositions.map((prop, index) => (
                <p 
                  key={index} 
                  className="text-xl md:text-2xl text-electric-blue font-heading font-medium h-10 flex items-center justify-center cyber-text-glow"
                >
                  {prop}
                </p>
              ))}
            </div>
          </div>
          
          <Link 
            to="/contact" 
            className="cta-button inline-flex items-center animate-fade-in-up [animation-delay:400ms]"
          >
            Deploy Your First Agent
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up [animation-delay:600ms]">
            <div className="stat-card">
              <div className="stat-value">99.8%</div>
              <div className="stat-label">Automation Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">85%</div>
              <div className="stat-label">Cost Reduction</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Continuous Operation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
