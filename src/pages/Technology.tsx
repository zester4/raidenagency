
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TechHero from '@/components/technology/TechHero';
import PlatformArchitecture from '@/components/technology/PlatformArchitecture';
import SecurityCompliance from '@/components/technology/SecurityCompliance';
import AiEthics from '@/components/technology/AiEthics';
import TechnologyShowcase from '@/components/TechnologyShowcase';

const Technology = () => {
  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <TechHero />
      
      {/* Platform Architecture */}
      <PlatformArchitecture />
      
      {/* Security & Compliance */}
      <SecurityCompliance />
      
      {/* AI Ethics Framework */}
      <AiEthics />
      
      {/* Technology Showcase - reusing existing component */}
      <TechnologyShowcase />
      
      <Footer />
    </div>
  );
};

export default Technology;
