
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Github, Twitter, Linkedin, Mail, ArrowRight, CreditCard, BarChart, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-raiden-black border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cyber-grid bg-[size:20px_20px] opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Logo />
              <span className="font-heading text-xl font-bold text-white">
                Raiden<span className="text-electric-blue">Agents</span>
              </span>
            </Link>
            <p className="text-white/60 mb-6">
              Building next-generation AI agents that revolutionize business operations and customer experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-heading text-lg mb-6">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Customer Support Agents
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Sales & Marketing Agents
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Operations Agents
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Data Analysis Agents
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Custom AI Solutions
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white/60 hover:text-electric-blue transition-colors duration-300 flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-heading text-lg mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-white/60 hover:text-electric-blue transition-colors duration-300 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-white/60 hover:text-electric-blue transition-colors duration-300 flex items-center">
                  <BarChart className="h-4 w-4 mr-1" />
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 hover:text-electric-blue transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-heading text-lg mb-6">Stay Updated</h3>
            <p className="text-white/60 mb-4">
              Subscribe to our newsletter for the latest AI agent innovations and industry insights.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/5 border border-white/10 rounded-l-md px-4 py-2 focus:outline-none focus:border-electric-blue text-white w-full"
              />
              <button className="bg-electric-blue text-raiden-black px-3 py-2 rounded-r-md hover:bg-electric-blue/90 transition-colors duration-300">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/40 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Raiden Agents. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-white/40 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/40 hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-white/40 hover:text-white transition-colors duration-300">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
