
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Github, 
  CornerRightUp, 
  Bot, 
  BarChart3, 
  Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 relative z-10">
      <div className="container mx-auto px-4 py-12">
        {/* CTA Section */}
        <div className="mb-16 relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 to-cyberpunk-purple/20 backdrop-blur-sm"></div>
          <div className="bg-[url(/circuit-board.svg)] bg-cover opacity-10 absolute inset-0"></div>
          <div className="relative z-10 py-12 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to build your AI agents?</h3>
              <p className="text-gray-400 max-w-md">Join thousands of businesses using Raiden to create, deploy, and manage AI agents today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/pricing">
                <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/10">
                  See Pricing
                </Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple hover:from-electric-blue/90 hover:to-cyberpunk-purple/90">
                  Get Started Free
                  <CornerRightUp className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Logo className="h-8 w-auto" />
              <span className="ml-3 text-xl font-bold text-white">Raiden</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Building the next generation of AI agents to help businesses automate tasks, improve customer experiences, and drive growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Platform */}
          <div>
            <h3 className="text-white font-medium mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-electric-blue" />
                  Agent Builder
                </Link>
              </li>
              <li>
                <Link to="/dashboard/tools" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-cyberpunk-purple" />
                  Tools & Integrations
                </Link>
              </li>
              <li>
                <Link to="/services#knowledge-base" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-holographic-teal" />
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-amber-400" />
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-medium mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-gray-400 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-medium mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-400 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Raiden AI, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
