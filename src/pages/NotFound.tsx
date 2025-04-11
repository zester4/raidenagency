
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-raiden-black text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="glass-panel max-w-md mx-auto p-8 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="text-[20rem] font-heading font-bold">404</div>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-6xl font-heading cyber-text-glow mb-4">404</h1>
              <div className="h-1 w-20 bg-electric-blue mx-auto mb-6"></div>
              <h2 className="text-2xl font-heading mb-4">Signal Lost</h2>
              <p className="text-white/70 mb-8">
                The AI agent couldn't locate the requested resource. The neural pathway you're looking for might have been moved or no longer exists.
              </p>
              <Link 
                to="/" 
                className="cta-button inline-flex items-center"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Base
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
