
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Globe, 
  Mail,
  Bot
} from 'lucide-react';
import Logo from '@/components/Logo';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Logo />
              <span className="ml-3 text-xl font-bold text-white">Raiden</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Building the future of AI agents with state-of-the-art language models 
              and innovative agent architecture.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-400" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-400" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-400" />
              </a>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Agent Builder
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Enterprise
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/case-studies" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-electric-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors">
                  Data Processing
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Raiden, Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">
              <Globe className="h-4 w-4 inline mr-1" />
              English (US)
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">
              <Mail className="h-4 w-4 inline mr-1" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
