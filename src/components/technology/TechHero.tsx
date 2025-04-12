
import React from 'react';
import { motion } from 'framer-motion';

const TechHero = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Neural network background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
        
        {/* Animated neural network nodes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-5xl mx-auto">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-electric-blue/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
            
            {/* Connection lines */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute h-px bg-electric-blue/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${50 + Math.random() * 100}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 cyber-text-glow shimmer-text">
            The Architecture Behind Raiden Intelligence
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12">
            Advanced AI systems designed for enterprise reliability
          </p>
          
          {/* Visual element: 3D stack representation */}
          <motion.div 
            className="glass-panel p-8 rounded-xl mt-8 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative h-64 md:h-96">
              {/* Stacked layers representation */}
              {['Foundation', 'Intelligence Core', 'Interaction', 'Integration', 'Governance'].map((layer, index) => (
                <motion.div 
                  key={index}
                  className="absolute w-full rounded-lg border border-electric-blue/30 backdrop-blur-sm bg-white/5"
                  style={{ 
                    height: '60px', 
                    bottom: `${index * 70}px`,
                    left: '0',
                    right: '0',
                    zIndex: 5 - index
                  }}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 + (index * 0.15) }}
                >
                  <div className="flex items-center justify-between h-full px-6">
                    <span className="font-mono text-electric-blue">{layer} Layer</span>
                    <div className="h-3 w-32 bg-electric-blue/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-electric-blue/70"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, delay: 1 + (index * 0.2) }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Connecting lines */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`connect-${i}`}
                  className="absolute w-0.5 bg-electric-blue/30 left-1/2 transform -translate-x-1/2"
                  style={{
                    height: '10px',
                    bottom: `${i * 70 + 60}px`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1.5 + (i * 0.1) }}
                />
              ))}
              
              {/* Abstract data flow animation */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 2 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full bg-electric-blue"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '100%',
                    }}
                    animate={{
                      top: '0%',
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      ease: "linear"
                    }}
                  />
                ))}
              </motion.div>
            </div>
            
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 2 }}
            >
              <p className="text-white/60 text-sm">
                Interactive architecture diagram - scroll down to explore each layer
              </p>
              <motion.div
                className="mt-4 flex justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TechHero;
