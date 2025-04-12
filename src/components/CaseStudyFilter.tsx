
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Filter, ChevronDown, Check, Cpu, Users, LineChart, ShieldCheck, X } from 'lucide-react';

const CaseStudyFilter = () => {
  const [activeFilters, setActiveFilters] = useState({
    industry: '',
    challengeTypes: [] as string[],
    agentType: '',
    resultsMin: 20
  });
  
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  
  const industries = [
    "Financial Services", 
    "Healthcare", 
    "Retail", 
    "Manufacturing", 
    "Technology"
  ];
  
  const challengeTypes = [
    { id: "efficiency", label: "Operational Efficiency" },
    { id: "customer", label: "Customer Experience" },
    { id: "insights", label: "Data Insights" },
    { id: "security", label: "Security & Compliance" }
  ];
  
  const agentTypes = [
    { id: "support", label: "Customer Support", icon: Users },
    { id: "operations", label: "Operations", icon: Cpu },
    { id: "analytics", label: "Analytics", icon: LineChart },
    { id: "security", label: "Security", icon: ShieldCheck }
  ];
  
  const toggleChallengeType = (id: string) => {
    setActiveFilters(prev => {
      if (prev.challengeTypes.includes(id)) {
        return { ...prev, challengeTypes: prev.challengeTypes.filter(item => item !== id) };
      } else {
        return { ...prev, challengeTypes: [...prev.challengeTypes, id] };
      }
    });
  };
  
  const clearFilters = () => {
    setActiveFilters({
      industry: '',
      challengeTypes: [],
      agentType: '',
      resultsMin: 20
    });
  };
  
  const hasActiveFilters = activeFilters.industry || activeFilters.challengeTypes.length > 0 || 
                         activeFilters.agentType || activeFilters.resultsMin > 20;
  
  return (
    <section className="py-8 bg-gradient-to-b from-raiden-black to-black/40">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel px-6 py-5 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-electric-blue">
              <Filter size={20} />
              <h3 className="font-heading text-lg">Filter Case Studies</h3>
            </div>
            
            {/* Industry Filter */}
            <div className="relative">
              <button 
                onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                className="glass-card min-w-[200px] px-4 py-2 flex items-center justify-between border border-white/10 hover:border-electric-blue/50 rounded-md"
              >
                <span className="text-white/80">
                  {activeFilters.industry || "All Industries"}
                </span>
                <ChevronDown size={16} className={`transition-transform ${isIndustryOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isIndustryOpen && (
                <div className="absolute top-full mt-2 w-full z-20 bg-black/90 border border-white/10 backdrop-blur-lg rounded-md shadow-neon-blue overflow-hidden">
                  <ul>
                    <li 
                      className="px-4 py-2 hover:bg-electric-blue/10 cursor-pointer flex items-center"
                      onClick={() => {
                        setActiveFilters(prev => ({ ...prev, industry: '' }));
                        setIsIndustryOpen(false);
                      }}
                    >
                      <span className="mr-2">{activeFilters.industry === '' && <Check size={16} className="text-electric-blue" />}</span>
                      All Industries
                    </li>
                    {industries.map(industry => (
                      <li 
                        key={industry}
                        className="px-4 py-2 hover:bg-electric-blue/10 cursor-pointer flex items-center"
                        onClick={() => {
                          setActiveFilters(prev => ({ ...prev, industry }));
                          setIsIndustryOpen(false);
                        }}
                      >
                        <span className="mr-2">{activeFilters.industry === industry && <Check size={16} className="text-electric-blue" />}</span>
                        {industry}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Challenge Type Filters - Hexagon Toggles */}
            <div className="flex flex-wrap gap-2">
              {challengeTypes.map(challenge => (
                <button
                  key={challenge.id}
                  onClick={() => toggleChallengeType(challenge.id)}
                  className={`hexagon-filter px-3 py-1 text-sm border ${
                    activeFilters.challengeTypes.includes(challenge.id)
                      ? 'border-electric-blue bg-electric-blue/20 text-white'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  } rounded-full transition-colors`}
                >
                  {challenge.label}
                </button>
              ))}
            </div>
            
            {/* Agent Type - Icon Selector */}
            <div className="flex gap-2">
              {agentTypes.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setActiveFilters(prev => ({ 
                    ...prev, 
                    agentType: prev.agentType === agent.id ? '' : agent.id 
                  }))}
                  className={`p-2 rounded-md transition-all ${
                    activeFilters.agentType === agent.id
                      ? 'bg-electric-blue/20 text-electric-blue shadow-neon-blue'
                      : 'glass-card text-white/70 hover:text-white'
                  }`}
                  title={agent.label}
                >
                  <agent.icon size={20} />
                </button>
              ))}
            </div>
            
            {/* Results Slider */}
            <div className="w-full md:w-auto flex flex-col">
              <span className="text-sm text-white/70 mb-1">Results Impact: {activeFilters.resultsMin}%+</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={activeFilters.resultsMin}
                onChange={(e) => setActiveFilters(prev => ({ ...prev, resultsMin: parseInt(e.target.value) }))}
                className="range-slider"
              />
            </div>
            
            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-white/70 hover:text-white flex items-center gap-1 text-sm"
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
          </div>
          
          {/* Visual feedback for filtering - animated line */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-electric-blue via-cyber-purple to-holo-teal animate-text-shimmer"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudyFilter;
