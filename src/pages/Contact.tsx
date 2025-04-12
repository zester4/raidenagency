
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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-neural-network bg-cover bg-center bg-no-repeat opacity-20 z-0"></div>
        <div className="absolute w-full h-full">
          <div className="absolute inset-0">
            {/* Animated particles would be implemented here with Three.js or a similar library */}
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
              Multiple channels for seamless communication
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Options Grid */}
      <ContactOptions />
      
      {/* Intelligent Contact Form */}
      <ContactForm />
      
      {/* Global Offices */}
      <GlobalOffices />
      
      {/* Support Options */}
      <SupportOptions />
      
      {/* Newsletter & Social */}
      <Newsletter />
      
      <Footer />
    </div>
  );
};

export default Contact;
