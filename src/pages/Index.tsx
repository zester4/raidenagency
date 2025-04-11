
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesOverview from '@/components/ServicesOverview';
import TechnologyShowcase from '@/components/TechnologyShowcase';
import CaseStudyPreview from '@/components/CaseStudyPreview';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <ServicesOverview />
      <TechnologyShowcase />
      <CaseStudyPreview />
      <Footer />
    </div>
  );
};

export default Index;
