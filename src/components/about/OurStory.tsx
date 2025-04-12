
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const milestones = [
  {
    year: "2019",
    title: "Genesis",
    description: "Founded with a vision to create autonomous AI agents capable of enterprise-scale problem solving."
  },
  {
    year: "2020",
    title: "First Agent",
    description: "Launched our prototype autonomous agent for financial data processing, reducing manual tasks by 85%."
  },
  {
    year: "2021",
    title: "Enterprise Adoption",
    description: "Deployed our first enterprise-scale solution with Fortune 500 companies, proving 24/7 reliability."
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Opened offices across three continents and expanded our team to over 100 AI specialists."
  },
  {
    year: "2023",
    title: "Multi-Agent Network",
    description: "Pioneered the first inter-operating multi-agent system capable of complex organizational workflows."
  },
  {
    year: "2024",
    title: "Frontier Research",
    description: "Established our Advanced Intelligence Lab, pushing the boundaries of agent autonomy and collaboration."
  }
];

const OurStory = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0.1, 0.7, 1]);
  
  return (
    <section className="py-24 relative overflow-hidden" id="story">
      <div className="absolute inset-0 bg-circuit-board bg-repeat opacity-5 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Our Story</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            The journey from concept to creating the future of intelligent agent technology
          </p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto py-10">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-electric-blue/30 transform md:-translate-x-1/2 z-0"></div>
          
          {/* Milestones */}
          {milestones.map((milestone, index) => (
            <motion.div 
              key={index}
              className="relative mb-16 last:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              {/* Timeline node */}
              <div className="timeline-node">
                <div className="timeline-node-inner"></div>
              </div>
              
              {/* Content card - alternating left and right */}
              <div className={`md:w-5/12 ml-8 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <div className="timeline-card group hover:border-electric-blue transition-all duration-300">
                  <div className={`inline-block px-3 py-1 rounded text-sm mb-2 ${index % 2 === 0 ? 'bg-electric-blue/20 text-electric-blue' : 'bg-cyber-purple/20 text-cyber-purple'}`}>
                    {milestone.year}
                  </div>
                  <h3 className="text-xl font-heading mb-2 group-hover:cyber-text-glow">{milestone.title}</h3>
                  <p className="text-white/70">{milestone.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Metrics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="stat-card">
            <div className="stat-value">5+</div>
            <div className="stat-label">Years of Innovation</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">200+</div>
            <div className="stat-label">Team Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">12</div>
            <div className="stat-label">Global Offices</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">300+</div>
            <div className="stat-label">Enterprise Deployments</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;
