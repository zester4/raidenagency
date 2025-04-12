
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Globe, Zap, Shield, Code } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 cyber-text-glow shimmer-text">
            Pioneering the Future of AI Agency
          </h1>
          <p className="text-xl text-white/80 mb-12">
            Our mission to transform enterprise intelligence
          </p>
        </motion.div>

        {/* Core Values Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-heading text-center mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                icon: Lightbulb, 
                title: "Innovation Excellence", 
                description: "Pushing boundaries to create revolutionary AI solutions" 
              },
              { 
                icon: Shield, 
                title: "Ethical Intelligence", 
                description: "Developing AI with strong ethical principles at its core" 
              },
              { 
                icon: Zap, 
                title: "Enterprise Reliability", 
                description: "Building systems that businesses can depend on 24/7" 
              },
              { 
                icon: Users, 
                title: "Human-Centered Design", 
                description: "Creating technology that enhances human capabilities" 
              },
              { 
                icon: Code, 
                title: "Technical Mastery", 
                description: "Maintaining exceptional standards in all we build" 
              },
              { 
                icon: Globe, 
                title: "Global Perspective", 
                description: "Solutions designed for diverse markets and users" 
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 hover:border-electric-blue hover:shadow-neon-blue transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-electric-blue/10 p-4 rounded-lg inline-block mb-4">
                  <value.icon className="h-6 w-6 text-electric-blue" />
                </div>
                <h3 className="text-xl font-heading mb-2">{value.title}</h3>
                <p className="text-white/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Info Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto text-center glass-panel p-8 rounded-xl mb-24"
        >
          <h2 className="text-2xl font-heading mb-6">
            Our Story <span className="text-electric-blue">Coming Soon</span>
          </h2>
          <p className="text-white/70">
            We're working on a complete history of our company journey and mission. Check back soon to learn about our origins, team, and vision for the future of AI agents.
          </p>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
