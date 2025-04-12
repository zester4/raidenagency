
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Users, Database, Cpu, Award, Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const FeaturedCaseStudy = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <section className="py-20 bg-gradient-to-b from-black/40 to-raiden-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold shimmer-text">
            Featured Success Story
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            See how a global financial institution transformed their customer service operations with Raiden Agents
          </p>
        </motion.div>
        
        <div className="glass-panel p-6 md:p-10 relative overflow-hidden border border-white/10 neon-border">
          {/* Before/After Interactive Comparison */}
          <div className="mb-16 relative h-64 md:h-80 bg-gradient-to-r from-black/60 to-black/40 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/70 mb-2">Interactive Before/After Comparison</p>
                <span className="text-electric-blue text-sm">Drag slider to compare</span>
              </div>
            </div>
            
            {/* This would be implemented with a proper before/after slider component */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/80 to-black/60 border-r border-electric-blue">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/50 text-center">
                  <p className="font-heading">BEFORE</p>
                  <p className="text-sm mt-2">Manual Process</p>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-black/60 to-black/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-electric-blue text-center">
                  <p className="font-heading">AFTER</p>
                  <p className="text-sm mt-2">Raiden Agent Solution</p>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-y-0 left-1/2 w-1 bg-electric-blue transform -translate-x-1/2 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-raiden-black border-2 border-electric-blue flex items-center justify-center">
                <ArrowRight className="text-electric-blue -ml-3" />
                <ArrowRight className="text-electric-blue ml-3" />
              </div>
            </div>
          </div>
          
          {/* Tabs navigation */}
          <div className="flex flex-wrap border-b border-white/10 mb-10">
            {['overview', 'solution', 'results', 'testimonial', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-heading capitalize transition-colors relative ${
                  activeTab === tab 
                    ? 'text-electric-blue' 
                    : 'text-white/60 hover:text-white/90'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-blue"
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Content for each tab */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-heading mb-4">Global Financial Services Leader</h3>
                  <p className="text-white/80 mb-6">
                    A Fortune 500 financial institution with over 50,000 employees and 20 million customers worldwide 
                    sought to revolutionize their customer support operations while maintaining strict security and 
                    compliance requirements.
                  </p>
                  <div className="mb-6">
                    <h4 className="font-heading text-xl mb-3">The Challenge</h4>
                    <p className="text-white/80">
                      The client faced mounting pressure from digital-native competitors, rising customer expectations for 
                      24/7 support, and increasing operational costs. Their legacy systems couldn't scale to meet demand, 
                      resulting in long wait times, inconsistent customer experiences, and agent burnout.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="stat-card flex-1">
                      <p className="stat-value">87%</p>
                      <p className="stat-label">Faster Resolution</p>
                    </div>
                    <div className="stat-card flex-1">
                      <p className="stat-value">93%</p>
                      <p className="stat-label">Customer Satisfaction</p>
                    </div>
                    <div className="stat-card flex-1">
                      <p className="stat-value">35%</p>
                      <p className="stat-label">Cost Reduction</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Card className="glass-card bg-gradient-to-br from-black/40 to-black/20">
                    <CardContent className="p-5">
                      <h4 className="font-heading text-lg mb-3 flex items-center gap-2">
                        <Users className="text-electric-blue" size={18} />
                        Client Profile
                      </h4>
                      <ul className="space-y-2 text-white/80">
                        <li className="flex justify-between">
                          <span>Industry:</span>
                          <span className="text-electric-blue">Financial Services</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Size:</span>
                          <span>50,000+ employees</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Market:</span>
                          <span>Global</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Annual Revenue:</span>
                          <span>$40B+</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card bg-gradient-to-br from-black/40 to-black/20">
                    <CardContent className="p-5">
                      <h4 className="font-heading text-lg mb-3 flex items-center gap-2">
                        <Calendar className="text-electric-blue" size={18} />
                        Project Timeline
                      </h4>
                      <ul className="space-y-2 text-white/80">
                        <li className="flex justify-between">
                          <span>Discovery:</span>
                          <span>2 weeks</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Implementation:</span>
                          <span>8 weeks</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Optimization:</span>
                          <span>Ongoing</span>
                        </li>
                        <li className="flex justify-between">
                          <span>ROI Achievement:</span>
                          <span className="text-holo-teal">3 months</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'solution' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading mb-4">Intelligent Solution Architecture</h3>
                  <p className="text-white/80 max-w-3xl mx-auto">
                    We deployed a multi-agent ecosystem designed specifically for financial services support operations, 
                    with advanced security protocols and full compliance features.
                  </p>
                </div>
                
                {/* Solution architecture diagram - a simplified version */}
                <div className="relative h-[400px] border border-white/10 rounded-xl bg-gradient-to-b from-black/40 to-transparent p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-hex-pattern opacity-5"></div>
                  
                  {/* This would be a more interactive diagram in production */}
                  <div className="relative h-full flex flex-col items-center justify-center">
                    <div className="text-center mb-12">
                      <p className="text-white/70 mb-2">Interactive Solution Architecture</p>
                      <span className="text-electric-blue text-sm">Click components to explore details</span>
                    </div>
                    
                    {/* Central node */}
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-electric-blue/20 to-transparent border border-electric-blue/30 flex items-center justify-center mb-8">
                      <Cpu size={32} className="text-electric-blue" />
                      <p className="text-sm font-heading mt-1">Core Agent</p>
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-electric-blue animate-pulse"></div>
                    </div>
                    
                    {/* Connected nodes */}
                    <div className="flex gap-16 items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyber-purple/20 to-transparent border border-cyber-purple/30 flex flex-col items-center justify-center">
                        <Users size={20} className="text-cyber-purple" />
                        <p className="text-xs font-heading mt-1">User Interface</p>
                      </div>
                      
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-holo-teal/20 to-transparent border border-holo-teal/30 flex flex-col items-center justify-center">
                        <Database size={20} className="text-holo-teal" />
                        <p className="text-xs font-heading mt-1">Knowledge Base</p>
                      </div>
                    </div>
                    
                    {/* Connection lines would be animated in production */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <Card className="glass-card h-full">
                    <CardContent className="p-5 h-full flex flex-col">
                      <h4 className="font-heading text-lg mb-3 text-electric-blue">Customer-Facing Agents</h4>
                      <p className="text-white/80 text-sm flex-grow">
                        Natural language processing agents capable of understanding complex financial queries and providing 
                        accurate responses with appropriate security protocols.
                      </p>
                      <ul className="mt-4 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-electric-blue" />
                          <span>24/7 multilingual support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-electric-blue" />
                          <span>Secure authentication</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-electric-blue" />
                          <span>Personalized responses</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card h-full">
                    <CardContent className="p-5 h-full flex flex-col">
                      <h4 className="font-heading text-lg mb-3 text-cyber-purple">Internal Support Agents</h4>
                      <p className="text-white/80 text-sm flex-grow">
                        AI assistants that help human agents find information faster, automate routine tasks, and ensure 
                        compliance with financial regulations.
                      </p>
                      <ul className="mt-4 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-cyber-purple" />
                          <span>Regulation compliance</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-cyber-purple" />
                          <span>Documentation automation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-cyber-purple" />
                          <span>Knowledge augmentation</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card h-full">
                    <CardContent className="p-5 h-full flex flex-col">
                      <h4 className="font-heading text-lg mb-3 text-holo-teal">Analytics Agents</h4>
                      <p className="text-white/80 text-sm flex-grow">
                        Intelligent systems that continuously analyze support interactions to identify trends, improvement 
                        opportunities, and training needs.
                      </p>
                      <ul className="mt-4 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-holo-teal" />
                          <span>Sentiment analysis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-holo-teal" />
                          <span>Trend identification</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-holo-teal" />
                          <span>Continuous improvement</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'results' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading mb-4">Transformative Results</h3>
                  <p className="text-white/80 max-w-3xl mx-auto">
                    Within three months of implementation, the Raiden Agent ecosystem delivered significant improvements 
                    across all key performance indicators.
                  </p>
                </div>
                
                {/* Results dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="glass-card p-5">
                      <h4 className="font-heading text-lg mb-4 flex items-center gap-2">
                        <Award className="text-electric-blue" size={18} />
                        Key Performance Improvements
                      </h4>
                      
                      {/* These would be animated charts in production */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Response Time</span>
                            <span className="text-electric-blue">87% Faster</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-electric-blue rounded-full" style={{ width: '87%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Customer Satisfaction</span>
                            <span className="text-cyber-purple">93% Positive</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-cyber-purple rounded-full" style={{ width: '93%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Operational Costs</span>
                            <span className="text-holo-teal">35% Reduction</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-holo-teal rounded-full" style={{ width: '35%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Agent Productivity</span>
                            <span className="text-electric-blue">128% Increase</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-electric-blue rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-5">
                      <h4 className="font-heading text-lg mb-4">ROI Analysis</h4>
                      <div className="space-y-3 text-white/80">
                        <div className="flex justify-between">
                          <span>Initial Investment</span>
                          <span>$1.2M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Cost Savings</span>
                          <span className="text-holo-teal">$4.7M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue Impact</span>
                          <span className="text-cyber-purple">$8.3M</span>
                        </div>
                        <div className="flex justify-between font-heading text-white pt-2 border-t border-white/10">
                          <span>ROI (12 months)</span>
                          <span className="text-electric-blue">1,083%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="glass-card p-5">
                      <h4 className="font-heading text-lg mb-4">Industry Benchmark Comparison</h4>
                      <div className="h-64 relative bg-black/20 rounded-lg p-4 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-white/70 mb-2">Benchmark Comparison Chart</p>
                          <span className="text-electric-blue text-sm">Interactive chart showing performance vs industry average</span>
                        </div>
                        {/* This would be an actual chart in production */}
                      </div>
                      <div className="mt-4 p-3 bg-black/20 rounded border border-white/10">
                        <p className="text-sm text-white/80">
                          The solution outperforms industry averages across all metrics, placing the client in the top 5% 
                          of financial institutions for customer service efficiency.
                        </p>
                      </div>
                    </div>
                    
                    <div className="glass-card p-5">
                      <h4 className="font-heading text-lg mb-4">Ongoing Improvements</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-electric-blue/20 flex items-center justify-center mt-0.5">
                            <ChevronRight size={14} className="text-electric-blue" />
                          </div>
                          <p className="text-sm text-white/80">
                            Self-optimizing agents continue to improve performance by 3-5% quarterly
                          </p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-cyber-purple/20 flex items-center justify-center mt-0.5">
                            <ChevronRight size={14} className="text-cyber-purple" />
                          </div>
                          <p className="text-sm text-white/80">
                            New capabilities added through quarterly releases
                          </p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-holo-teal/20 flex items-center justify-center mt-0.5">
                            <ChevronRight size={14} className="text-holo-teal" />
                          </div>
                          <p className="text-sm text-white/80">
                            Expansion to additional departments currently in progress
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'testimonial' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto text-center py-12"
              >
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-electric-blue/30 to-cyber-purple/30 backdrop-blur-md p-1">
                    <div className="w-full h-full rounded-full bg-raiden-black flex items-center justify-center">
                      <Users size={32} className="text-electric-blue" />
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-xl md:text-2xl font-light mb-8 relative">
                  <span className="absolute -top-8 -left-4 text-6xl text-electric-blue/20">"</span>
                  <p className="text-white/90 italic">
                    Implementing Raiden's AI agent ecosystem transformed our customer service capabilities beyond our expectations. 
                    We've not only seen dramatic improvements in efficiency and customer satisfaction but have also empowered our 
                    human agents to focus on complex, high-value interactions. The ROI has been extraordinary.
                  </p>
                  <span className="absolute -bottom-10 -right-4 text-6xl text-electric-blue/20">"</span>
                </blockquote>
                
                <div className="mt-10">
                  <p className="font-heading text-lg text-electric-blue">Chief Digital Officer</p>
                  <p className="text-white/60">Global Financial Services Leader</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'timeline' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading mb-4">Implementation Journey</h3>
                  <p className="text-white/80 max-w-3xl mx-auto">
                    The transformation from legacy systems to an advanced AI ecosystem was completed in under 3 months.
                  </p>
                </div>
                
                <div className="relative py-8">
                  {/* Timeline line */}
                  <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 bg-white/10"></div>
                  
                  {/* Timeline nodes */}
                  <div className="space-y-12">
                    {[
                      {
                        date: "Week 1-2",
                        title: "Discovery & Planning",
                        description: "Comprehensive analysis of existing systems, customer journey mapping, and detailed requirements gathering.",
                        color: "electric-blue",
                        align: "left"
                      },
                      {
                        date: "Week 3-4",
                        title: "Architecture Design",
                        description: "Custom architecture design, security protocol development, and integration planning with legacy systems.",
                        color: "cyber-purple",
                        align: "right"
                      },
                      {
                        date: "Week 5-8",
                        title: "Development & Testing",
                        description: "Agent development, training on financial domain knowledge, security testing, and performance optimization.",
                        color: "holo-teal",
                        align: "left"
                      },
                      {
                        date: "Week 9-10",
                        title: "Deployment & Training",
                        description: "Phased rollout, human agent training, and monitoring systems implementation.",
                        color: "electric-blue",
                        align: "right"
                      },
                      {
                        date: "Week 11-12",
                        title: "Optimization & Expansion",
                        description: "Performance tuning based on real-world data, capability expansion, and additional use case development.",
                        color: "cyber-purple",
                        align: "left"
                      }
                    ].map((item, index) => (
                      <div key={index} className={`relative flex flex-col ${
                        item.align === "left" || !item.align
                          ? "md:flex-row" 
                          : "md:flex-row-reverse"
                        } items-center gap-8`}
                      >
                        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center">
                          <div className={`h-8 w-8 rounded-full bg-${item.color}/20 border border-${item.color} flex items-center justify-center z-10`}>
                            <div className={`h-3 w-3 rounded-full bg-${item.color}`}></div>
                          </div>
                        </div>
                        
                        <div className={`md:w-1/2 pl-12 md:pl-0 ${
                          item.align === "right" ? "md:pr-8" : "md:pl-8"
                        }`}>
                          <div className="glass-card p-4 h-full">
                            <p className={`text-${item.color} font-mono text-sm mb-2`}>{item.date}</p>
                            <h4 className="font-heading text-lg mb-2">{item.title}</h4>
                            <p className="text-white/70 text-sm">{item.description}</p>
                          </div>
                        </div>
                        
                        <div className="hidden md:block md:w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-12 p-6 bg-gradient-to-r from-electric-blue/10 to-transparent border border-white/10 rounded-lg">
                  <h4 className="font-heading text-xl mb-4">Similar Case Studies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      "Healthcare Provider Support Transformation", 
                      "Retail Banking Customer Experience", 
                      "Insurance Claims Processing Automation"
                    ].map((title, index) => (
                      <div key={index} className="glass-card p-4 hover:border-electric-blue/50 cursor-pointer transition-all">
                        <h5 className="font-heading text-sm mb-2">{title}</h5>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/60">Financial Services</span>
                          <span className="text-electric-blue flex items-center gap-1">
                            View Case <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCaseStudy;
