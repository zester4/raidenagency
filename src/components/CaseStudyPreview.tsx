
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';

const CaseStudyPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-raiden-black to-raiden-black/95 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="shimmer-text mb-4">Real-World Impact</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            See how our AI agents are transforming enterprise operations and customer experiences
          </p>
        </div>
        
        <div className="glass-panel p-8 max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <div className="relative h-full">
                {/* Before/After comparison (simplified version) */}
                <div className="relative h-64 md:h-80 glass-card overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 bg-gradient-to-br from-raiden-black to-raiden-black/90 p-6">
                      <div className="text-white/50 text-sm mb-2">BEFORE</div>
                      <div className="space-y-3">
                        <div className="h-3 w-3/4 bg-white/20 rounded-full"></div>
                        <div className="h-3 w-1/2 bg-white/20 rounded-full"></div>
                        <div className="h-3 w-2/3 bg-white/20 rounded-full"></div>
                        <div className="h-3 w-3/5 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="mt-6 flex items-center">
                        <div className="text-red-400 flex items-center">
                          <div className="transform rotate-180">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                          <span className="ml-1">-23%</span>
                        </div>
                        <div className="ml-4 text-xs text-white/50">Efficiency</div>
                      </div>
                    </div>
                    <div className="w-1/2 bg-gradient-to-br from-raiden-black/90 to-electric-blue/5 p-6">
                      <div className="text-electric-blue text-sm mb-2">AFTER</div>
                      <div className="space-y-3">
                        <div className="h-3 w-3/4 bg-electric-blue/30 rounded-full"></div>
                        <div className="h-3 w-1/2 bg-electric-blue/30 rounded-full"></div>
                        <div className="h-3 w-2/3 bg-electric-blue/30 rounded-full"></div>
                        <div className="h-3 w-3/5 bg-electric-blue/30 rounded-full"></div>
                      </div>
                      <div className="mt-6 flex items-center">
                        <div className="text-green-400 flex items-center">
                          <TrendingUp className="h-4 w-4" />
                          <span className="ml-1">+187%</span>
                        </div>
                        <div className="ml-4 text-xs text-white/50">Efficiency</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-electric-blue/50"></div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="stat-card py-3 px-2">
                    <div className="stat-value text-2xl">85%</div>
                    <div className="stat-label text-xs">Cost Savings</div>
                  </div>
                  <div className="stat-card py-3 px-2">
                    <div className="stat-value text-2xl">15x</div>
                    <div className="stat-label text-xs">Faster Response</div>
                  </div>
                  <div className="stat-card py-3 px-2">
                    <div className="stat-value text-2xl">24/7</div>
                    <div className="stat-label text-xs">Availability</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <h3 className="text-2xl font-heading text-white mb-4">Global Financial Services Provider</h3>
              <div className="bg-electric-blue/10 text-electric-blue text-sm font-medium px-3 py-1 rounded inline-block mb-4">
                Customer Support Automation
              </div>
              <p className="text-white/80 mb-6">
                Implemented our AI Agent solution to transform customer support operations across 15 countries and 8 languages, handling over 2 million inquiries monthly with human-like precision and contextual awareness.
              </p>
              
              <div className="mb-8">
                <blockquote className="border-l-2 border-cyber-purple pl-4 italic text-white/70">
                  "Raiden Agents transformed our customer support operations beyond recognition. What used to take hours now happens in seconds, with higher customer satisfaction ratings than we've ever achieved."
                </blockquote>
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-cyber-purple"></div>
                  <div className="ml-3">
                    <div className="text-white font-medium">Sarah Chen</div>
                    <div className="text-white/60 text-sm">Chief Customer Officer</div>
                  </div>
                </div>
              </div>
              
              <Link to="/case-studies" className="cta-button inline-flex items-center">
                View Full Case Study
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyPreview;
