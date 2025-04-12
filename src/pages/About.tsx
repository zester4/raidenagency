
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamSection from '@/components/about/TeamSection';
import OurStory from '@/components/about/OurStory';
import CoreValues from '@/components/about/CoreValues';
import GlobalPresence from '@/components/about/GlobalPresence';
import Partners from '@/components/about/Partners';
import JoinTeam from '@/components/about/JoinTeam';

const About = () => {
  // Animation controls for the sequence effect
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 bg-neural-network bg-cover bg-center bg-no-repeat opacity-20 z-0"></div>
        <div className="absolute w-full h-full">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-electric-blue rounded-full opacity-5 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-cyberpunk-purple rounded-full opacity-5 blur-[100px] animate-pulse"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 z-10 relative">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              hidden: { opacity: 0, y: 20 }
            }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 cyber-text-glow shimmer-text">
              Pioneering the Future of AI Agency
            </h1>
            <p className="text-xl text-white/80 mb-12">
              Our mission to transform enterprise intelligence through autonomous agents
              that elevate human potential and business capabilities.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative w-full h-16 md:h-24 mt-8 mb-12"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-raiden-black px-6 text-electric-blue font-heading">
                  EST. 2019
                </div>
              </div>
            </motion.div>
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
