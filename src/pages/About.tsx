
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamSection from '@/components/about/TeamSection';
import OurStory from '@/components/about/OurStory';
import CoreValues from '@/components/about/CoreValues';
import GlobalPresence from '@/components/about/GlobalPresence';
import Partners from '@/components/about/Partners';
import JoinTeam from '@/components/about/JoinTeam';

const About = () => {
  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-neural-network bg-cover bg-center bg-no-repeat opacity-20 z-0"></div>
        <div className="absolute w-full h-full">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-electric-blue rounded-full opacity-5 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-cyberpunk-purple rounded-full opacity-5 blur-[100px] animate-pulse"></div>
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
              Pioneering the Future of AI Agency
            </h1>
            <p className="text-xl text-white/80 mb-12">
              Our mission to transform enterprise intelligence
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <OurStory />
      
      {/* Core Values Section */}
      <CoreValues />
      
      {/* Team Section */}
      <TeamSection />
      
      {/* Partners & Ecosystem Section */}
      <Partners />
      
      {/* Global Presence Section */}
      <GlobalPresence />
      
      {/* Join Our Team Section */}
      <JoinTeam />
      
      <Footer />
    </div>
  );
};

export default About;
