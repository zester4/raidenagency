
import React from 'react';
import { motion } from 'framer-motion';
import { Send, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-raiden-black bg-opacity-90 z-0"></div>
      <div className="absolute w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-electric-blue rounded-full opacity-5 blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-cyberpunk-purple rounded-full opacity-5 blur-[150px] animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-xl"
          >
            <h3 className="text-2xl font-heading mb-6 cyber-text-glow">Stay Connected</h3>
            <p className="text-white/70 mb-8">
              Subscribe to our newsletter to receive updates on the latest AI agent technology, company news, and industry insights.
            </p>
            
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow bg-white/5 border border-white/10 rounded-l-md px-4 py-3 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-electric-blue hover:bg-electric-blue/80 text-raiden-black font-heading px-4 py-3 rounded-r-md transition-all duration-300 flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <input type="checkbox" id="consent" className="h-4 w-4 accent-electric-blue" />
              </div>
              <label htmlFor="consent" className="text-xs text-white/60">
                I agree to receive marketing communications from Raiden Agents. You can unsubscribe at any time.
              </label>
            </div>
          </motion.div>
          
          {/* Social Channels */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-panel p-8 rounded-xl"
          >
            <h3 className="text-2xl font-heading mb-6 cyber-purple-glow">Follow Our Journey</h3>
            <p className="text-white/70 mb-8">
              Connect with us on social media for the latest updates, behind-the-scenes content, and community discussions.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Twitter, name: "Twitter", color: "bg-[#1DA1F2]/10", textColor: "text-[#1DA1F2]" },
                { icon: Linkedin, name: "LinkedIn", color: "bg-[#0A66C2]/10", textColor: "text-[#0A66C2]" },
                { icon: Github, name: "GitHub", color: "bg-white/10", textColor: "text-white" },
                { icon: Youtube, name: "YouTube", color: "bg-[#FF0000]/10", textColor: "text-[#FF0000]" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="flex flex-col items-center justify-center glass-effect rounded-lg p-4 hover:border-electric-blue transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`${social.color} p-2 rounded-full mb-2`}>
                    <social.icon className={`h-5 w-5 ${social.textColor}`} />
                  </div>
                  <span className="text-sm text-white/80">{social.name}</span>
                </motion.a>
              ))}
            </div>
            
            <div className="text-center text-sm text-white/60">
              Join our growing community of AI enthusiasts and technology professionals
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
