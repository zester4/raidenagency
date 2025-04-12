
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseStudiesHero from '@/components/CaseStudiesHero';
import CaseStudyFilter from '@/components/CaseStudyFilter';
import CaseStudyGrid from '@/components/CaseStudyGrid';
import FeaturedCaseStudy from '@/components/FeaturedCaseStudy';
import ResultsOverview from '@/components/ResultsOverview';

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      <CaseStudiesHero />
      <CaseStudyFilter />
      <CaseStudyGrid />
      <FeaturedCaseStudy />
      <ResultsOverview />
      <Footer />
    </div>
  );
};

export default CaseStudies;
