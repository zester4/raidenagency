
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Logo from './Logo';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarClass = isScrolled
    ? 'bg-raiden-black/80 shadow-lg backdrop-blur-md py-3'
    : 'bg-transparent py-5';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarClass}`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo />
          <span className="ml-3 text-xl font-heading text-white">Raiden Agents</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/case-studies" className="nav-link">Case Studies</Link>
          <Link to="/technology" className="nav-link">Technology</Link>
          
          {user ? (
            <Link to="/dashboard" className="cta-button text-sm px-4 py-2">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/auth" className="nav-link flex items-center">
                <LogIn size={18} className="mr-1" />
                Sign In
              </Link>
              <Link to="/auth?tab=signup" className="cta-button text-sm px-4 py-2 flex items-center">
                <UserPlus size={18} className="mr-1" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-raiden-black/90 backdrop-blur-lg"
        >
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <Link to="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/services" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link to="/case-studies" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Case Studies</Link>
            <Link to="/technology" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Technology</Link>
            
            {user ? (
              <Link to="/dashboard" className="cta-button text-sm px-4 py-2 text-center" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/auth" className="nav-link py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <LogIn size={18} className="mr-1" />
                  Sign In
                </Link>
                <Link to="/auth?tab=signup" className="cta-button text-sm px-4 py-2 text-center flex items-center justify-center mt-4" onClick={() => setIsMenuOpen(false)}>
                  <UserPlus size={18} className="mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
