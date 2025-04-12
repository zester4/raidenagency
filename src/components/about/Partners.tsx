
import React from 'react';
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';

// Partner categories
const partnerCategories = [
  {
    name: "Technology Partners",
    partners: [
      { name: "QuantumTech AI", type: "AI Infrastructure" },
      { name: "NeuralSystems Inc", type: "Neural Processing" },
      { name: "DataStream Global", type: "Data Processing" },
      { name: "CyberSec Solutions", type: "Security Framework" },
    ]
  },
  {
    name: "Implementation Partners",
    partners: [
      { name: "Enterprise Architects", type: "Solution Architecture" },
      { name: "Global Integration Group", type: "Enterprise Integration" },
      { name: "IndustryX Consulting", type: "Vertical Specialists" },
      { name: "AgileTransform", type: "Workflow Implementation" },
    ]
  },
  {
    name: "Research Partners",
    partners: [
      { name: "MIT AI Lab", type: "Academic Research" },
      { name: "Global AI Ethics Institute", type: "Ethical Frameworks" },
      { name: "Future Computing Foundation", type: "Next-Gen Computing" },
      { name: "Cognitive Science Alliance", type: "Human-AI Interaction" },
    ]
  }
];

const Partners = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="partners">
      <div className="absolute inset-0 bg-hex-pattern bg-repeat opacity-5 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Partners & Ecosystem</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Our collaborative network powering the next generation of intelligent agent technology
          </p>
        </motion.div>
        
        {/* Orbital visualization placeholder */}
        <motion.div
          className="w-full h-64 md:h-80 mb-16 glass-panel flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-white/50 text-center">
            <p className="text-lg mb-2">Orbital Partner Ecosystem Visualization</p>
            <p className="text-sm">(Placeholder for WebGL/Three.js implementation)</p>
          </div>
        </motion.div>
        
        {/* Partner categories */}
        <div className="space-y-20">
          {partnerCategories.map((category, catIndex) => (
            <div key={catIndex}>
              <motion.h3 
                className="text-2xl font-heading mb-8 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {category.name}
              </motion.h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.partners.map((partner, index) => (
                  <motion.div
                    key={index}
                    className="glass-card p-5 hover:border-electric-blue hover:shadow-neon-blue transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index % 4) }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-electric-blue/10 p-2 rounded-lg mr-3">
                        <Link2 className="h-4 w-4 text-electric-blue" />
                      </div>
                      <h4 className="font-heading">{partner.name}</h4>
                    </div>
                    <p className="text-sm text-white/60">{partner.type}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
