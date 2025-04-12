
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Calendar, MapPin, HelpCircle } from 'lucide-react';

const Contact = () => {
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
            Connect With Our Intelligence Network
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Multiple channels for seamless communication
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { 
              icon: Calendar, 
              title: "Schedule Demo", 
              description: "Book a guided tour of our platform" 
            },
            { 
              icon: MessageSquare, 
              title: "General Inquiry", 
              description: "Questions about our services" 
            },
            { 
              icon: HelpCircle, 
              title: "Support Request", 
              description: "Get help with existing systems" 
            },
            { 
              icon: Mail, 
              title: "Partner Inquiry", 
              description: "Explore collaboration opportunities" 
            },
            { 
              icon: Phone, 
              title: "Call Us", 
              description: "Speak directly with our team" 
            },
            { 
              icon: MapPin, 
              title: "Visit Us", 
              description: "Find our global office locations" 
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 cursor-pointer hover:border-electric-blue hover:shadow-neon-blue transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="bg-electric-blue/10 p-4 rounded-lg inline-block mb-4">
                <item.icon className="h-6 w-6 text-electric-blue" />
              </div>
              <h3 className="text-xl font-heading mb-2">{item.title}</h3>
              <p className="text-white/70">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-panel p-8 rounded-xl"
          >
            <h2 className="text-2xl font-heading mb-6 text-center">
              Contact Form <span className="text-electric-blue">Coming Soon</span>
            </h2>
            <p className="text-white/70 text-center">
              Our intelligent contact system is under development. Please check back soon for our advanced contact options.
            </p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
