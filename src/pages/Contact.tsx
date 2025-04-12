
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-raiden-black text-white overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 cyber-text-glow shimmer-text">
          Contact Us
        </h1>
        <p className="text-xl text-white/80">
          This page is under development. Check back soon for ways to get in touch with our team.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
