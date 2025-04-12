
import React from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

const ContactForm = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-circuit-board bg-repeat opacity-5 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Intelligent Contact Form</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Our AI-powered form adapts to your inquiry type for the most efficient communication
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-xl shadow-glass"
          >
            <div className="mb-10">
              <div className="flex justify-between mb-2">
                <h3 className="text-xl font-heading cyber-text-glow">Contact Form</h3>
                <div className="text-xs text-white/40">Estimated response time: 24hrs</div>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-electric-blue to-cyber-purple transition-all duration-500"></div>
              </div>
            </div>
            
            {/* Form fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-white/70 block">First Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all duration-300"
                    placeholder="Your first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70 block">Last Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all duration-300"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/70 block">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/70 block">Inquiry Type</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all duration-300"
                >
                  <option value="" disabled selected className="bg-raiden-black">Select inquiry type</option>
                  <option value="demo" className="bg-raiden-black">Request a Demo</option>
                  <option value="general" className="bg-raiden-black">General Question</option>
                  <option value="support" className="bg-raiden-black">Support Request</option>
                  <option value="partner" className="bg-raiden-black">Partnership Inquiry</option>
                  <option value="media" className="bg-raiden-black">Media Contact</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/70 block">Message</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all duration-300 min-h-[120px]"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-all duration-300 text-sm"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach Files
                </button>
                
                <button
                  type="submit"
                  className="cta-button inline-flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
