
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Shield, Zap, Users, Code, Globe } from 'lucide-react';

const coreValues = [
  { 
    icon: Lightbulb, 
    title: "Innovation Excellence", 
    description: "Pushing boundaries to create revolutionary AI solutions that redefine what's possible in enterprise automation and intelligence.",
    color: "bg-electric-blue/10",
    textColor: "text-electric-blue"
  },
  { 
    icon: Shield, 
    title: "Ethical Intelligence", 
    description: "Developing AI with strong ethical principles at its core, ensuring fair, transparent, and responsible technology.",
    color: "bg-cyberpunk-purple/10",
    textColor: "text-cyber-purple"
  },
  { 
    icon: Zap, 
    title: "Enterprise Reliability", 
    description: "Building systems that businesses can depend on 24/7, with robust architecture that scales with your needs.",
    color: "bg-holographic-teal/10",
    textColor: "text-holo-teal"
  },
  { 
    icon: Users, 
    title: "Human-Centered Design", 
    description: "Creating technology that enhances human capabilities rather than replacing them, with interfaces designed for seamless collaboration.",
    color: "bg-electric-blue/10",
    textColor: "text-electric-blue"
  },
  { 
    icon: Code, 
    title: "Technical Mastery", 
    description: "Maintaining exceptional standards in all we build, with continuous innovation and technical excellence as core principles.",
    color: "bg-cyberpunk-purple/10",
    textColor: "text-cyber-purple"
  },
  { 
    icon: Globe, 
    title: "Global Perspective", 
    description: "Solutions designed for diverse markets and users, with cultural intelligence built into our approach and technology.",
    color: "bg-holographic-teal/10",
    textColor: "text-holo-teal"
  },
];

const CoreValues = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="values">
      <div className="absolute inset-0 bg-hex-pattern bg-repeat opacity-5 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Our Core Values</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            The principles that guide our work and define our approach to AI innovation
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              className="hexagon group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className={`${value.color} p-4 rounded-lg inline-block mb-4 transition-all duration-300 group-hover:scale-110`}>
                  <value.icon className={`h-6 w-6 ${value.textColor}`} />
                </div>
                <h3 className="text-xl font-heading mb-2 group-hover:cyber-text-glow">{value.title}</h3>
                <p className="text-white/70 text-sm">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
