
import React from 'react';
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Clock, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const ResultsOverview = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-raiden-black to-black/90">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold shimmer-text">
            Aggregate Client Results
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            The combined impact of Raiden Agents across our client portfolio
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: Clock,
              value: "1.2M+",
              label: "Hours Saved Monthly",
              color: "from-electric-blue/20 to-transparent"
            },
            {
              icon: TrendingUp,
              value: "$240M+",
              label: "Revenue Impact",
              color: "from-cyber-purple/20 to-transparent"
            },
            {
              icon: Users,
              value: "87%",
              label: "Avg. Satisfaction Increase",
              color: "from-holo-teal/20 to-transparent"
            },
            {
              icon: BarChart3,
              value: "42%",
              label: "Operational Cost Reduction",
              color: "from-electric-blue/20 to-transparent"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card h-full relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-30`}></div>
                <CardContent className="p-6 relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-white/5">
                    <stat.icon className="h-8 w-8 text-electric-blue" />
                  </div>
                  <div className="text-3xl md:text-4xl font-heading font-bold cyber-text-glow mb-2 text-white">
                    {stat.value}
                  </div>
                  <p className="text-white/70">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="glass-panel p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-hex-pattern opacity-5"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-heading mb-4">Industry Benchmark Tool</h3>
              <p className="text-white/70 max-w-2xl mx-auto">
                See how your industry peers are performing with AI agent adoption
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 h-64 md:h-80 bg-black/20 rounded-xl p-4 border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white/70 mb-2">Interactive Industry Benchmark Visualization</p>
                  <span className="text-electric-blue text-sm">Select your industry to see comparative data</span>
                </div>
                {/* This would be an interactive visualization in production */}
              </div>
              
              <div className="space-y-6">
                <div className="glass-card p-5">
                  <h4 className="font-heading text-xl mb-4">Where Do You Stand?</h4>
                  <p className="text-white/70 text-sm mb-6">
                    Complete this brief assessment to receive a personalized analysis of your potential 
                    AI agent implementation impact.
                  </p>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Industry</label>
                      <select className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:border-electric-blue/50 text-white">
                        <option>Select your industry</option>
                        <option>Financial Services</option>
                        <option>Healthcare</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                        <option>Technology</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Company Size</label>
                      <select className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:border-electric-blue/50 text-white">
                        <option>Select company size</option>
                        <option>1-50 employees</option>
                        <option>51-200 employees</option>
                        <option>201-500 employees</option>
                        <option>501-1000 employees</option>
                        <option>1000+ employees</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-white/70 mb-1">Primary Challenge</label>
                      <select className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md focus:border-electric-blue/50 text-white">
                        <option>Select your challenge</option>
                        <option>Customer Service Efficiency</option>
                        <option>Operational Costs</option>
                        <option>Data Processing & Analysis</option>
                        <option>Employee Productivity</option>
                      </select>
                    </div>
                    
                    <button className="w-full cta-button py-2.5">
                      Get Your Analysis
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResultsOverview;
