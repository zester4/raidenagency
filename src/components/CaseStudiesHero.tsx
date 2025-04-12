
import React from 'react';
import { motion } from "framer-motion";

const CaseStudiesHero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background data visualization */}
      <div className="absolute inset-0 bg-circuit-board opacity-20 z-0"></div>
      <div className="absolute inset-0 bg-hex-pattern opacity-10 z-0 animate-pulse-glow"></div>
      
      <div className="container mx-auto px-6 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 cyber-text-glow shimmer-text">
            Transformative Results Through Intelligent Automation
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10">
            Explore how leading enterprises are leveraging Raiden Agents
          </p>
          
          {/* Interactive 3D globe placeholder - would be implemented with Three.js */}
          <div className="relative h-64 w-64 mx-auto mt-12 glass-panel rounded-full overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-electric-blue/10 animate-pulse-glow"></div>
            <div className="absolute inset-0 rounded-full border border-electric-blue/30"></div>
            <div className="absolute inset-2 rounded-full border border-electric-blue/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-electric-blue font-mono">GLOBAL CLIENT NETWORK</span>
            </div>
            {/* Pulsing indicators would be added dynamically */}
            <div className="absolute top-1/4 left-1/3 h-2 w-2 rounded-full bg-electric-blue animate-pulse-glow"></div>
            <div className="absolute top-1/2 left-2/3 h-2 w-2 rounded-full bg-cyber-purple animate-pulse-glow"></div>
            <div className="absolute top-3/4 left-1/4 h-2 w-2 rounded-full bg-holo-teal animate-pulse-glow"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudiesHero;
