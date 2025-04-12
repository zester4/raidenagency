
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactOptions from '@/components/contact/ContactOptions';
import ContactForm from '@/components/contact/ContactForm';
import GlobalOffices from '@/components/contact/GlobalOffices';
import SupportOptions from '@/components/contact/SupportOptions';
import Newsletter from '@/components/contact/Newsletter';

const Contact = () => {
  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 bg-neural-network bg-cover bg-center bg-no-repeat opacity-20 z-0"></div>
        <div className="absolute w-full h-full">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-electric-blue rounded-full opacity-5 blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-cyberpunk-purple rounded-full opacity-5 blur-[100px] animate-pulse"></div>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 cyber-text-glow shimmer-text">
              Connect With Our Intelligence Network
            </h1>
            <p className="text-xl text-white/80 mb-12">
              Multiple channels for seamless communication with our expert teams
            </p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a href="#form" className="cta-button flex items-center justify-center">
                <motion.span 
                  initial={{ x: -5 }}
                  animate={{ x: 0 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
                >
                  Contact Us Now
                </motion.span>
              </a>
              <a href="#offices" className="bg-transparent border border-electric-blue text-electric-blue hover:bg-electric-blue/10 px-6 py-3 rounded-md transition-colors duration-300">
                Find Our Offices
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Options Grid */}
      <ContactOptions />
      
      {/* Intelligent Contact Form */}
      <div id="form">
        <ContactForm />
      </div>
      
      {/* Global Offices */}
      <div id="offices">
        <GlobalOffices />
      </div>
      
      {/* Support Options */}
      <SupportOptions />
      
      {/* Newsletter & Social */}
      <Newsletter />
      
      <Footer />
    </div>
  );
};

export default Contact;
