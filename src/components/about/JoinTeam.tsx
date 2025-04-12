
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const JoinTeam = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="join-team">
      <div className="absolute inset-0 bg-raiden-black bg-opacity-80 z-0"></div>
      <div className="absolute w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-electric-blue rounded-full opacity-5 blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-cyberpunk-purple rounded-full opacity-5 blur-[150px] animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Join Our Team */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-xl"
          >
            <h3 className="text-2xl font-heading mb-6 cyber-text-glow">Join Our Team</h3>
            <p className="text-white/70 mb-8">
              We're looking for innovators, problem solvers, and visionaries to help us build the future of intelligent agent technology. Join a diverse team of AI experts committed to making a global impact.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-electric-blue mr-3"></div>
                <p className="text-white/80">Challenging work on cutting-edge AI technology</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-cyber-purple mr-3"></div>
                <p className="text-white/80">Collaborative culture with industry experts</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-holographic-teal mr-3"></div>
                <p className="text-white/80">Global opportunities across our worldwide offices</p>
              </div>
            </div>
            
            <Link 
              to="/careers"
              className="cta-button inline-flex items-center"
            >
              View Open Positions
            </Link>
          </motion.div>
          
          {/* Contact Leadership */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-xl"
          >
            <h3 className="text-2xl font-heading mb-6 cyber-purple-glow">Contact Leadership</h3>
            <p className="text-white/70 mb-8">
              Interested in partnering, media opportunities, or speaking with our executive team? Connect with us directly for strategic discussions and opportunities.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="glass-effect rounded-lg p-4 flex items-start">
                <div className="bg-electric-blue/10 p-2 rounded-lg mr-3">
                  <Mail className="h-5 w-5 text-electric-blue" />
                </div>
                <div>
                  <h4 className="font-heading text-white mb-1">Media & Partnership Inquiries</h4>
                  <p className="text-white/60 text-sm">partnerships@raidenagents.ai</p>
                </div>
              </div>
              
              <div className="glass-effect rounded-lg p-4 flex items-start">
                <div className="bg-cyber-purple/10 p-2 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-cyber-purple" />
                </div>
                <div>
                  <h4 className="font-heading text-white mb-1">Schedule Executive Meeting</h4>
                  <p className="text-white/60 text-sm">Available for strategic partnership discussions</p>
                </div>
              </div>
            </div>
            
            <Link 
              to="/contact"
              className="inline-flex items-center px-6 py-3 rounded-md relative overflow-hidden bg-white/10 hover:bg-white/20 border border-white/20 hover:border-electric-blue transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinTeam;
