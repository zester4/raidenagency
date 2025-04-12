
import React from 'react';
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Users, Database, LineChart, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// Mock case study data
const caseStudies = [
  {
    id: 1,
    client: "Financial Enterprise",
    industry: "Banking",
    challenge: "Customer support automation with 24/7 availability",
    keyMetric: { value: 87, label: "Customer Satisfaction" },
    icon: Users,
    color: "from-electric-blue/20 to-electric-blue/5"
  },
  {
    id: 2,
    client: "Healthcare Provider",
    industry: "Healthcare",
    challenge: "Patient data processing and insights generation",
    keyMetric: { value: 64, label: "Time Saved" },
    icon: Database,
    color: "from-cyber-purple/20 to-cyber-purple/5"
  },
  {
    id: 3,
    client: "Retail Chain",
    industry: "Retail",
    challenge: "Inventory optimization and demand forecasting",
    keyMetric: { value: 42, label: "Cost Reduction" },
    icon: LineChart,
    color: "from-holo-teal/20 to-holo-teal/5"
  },
  {
    id: 4,
    client: "Manufacturing Corp",
    industry: "Manufacturing",
    challenge: "Production workflow automation and quality control",
    keyMetric: { value: 93, label: "Defect Detection" },
    icon: Cpu,
    color: "from-electric-blue/20 to-electric-blue/5"
  },
  {
    id: 5,
    client: "Tech Innovators",
    industry: "Technology",
    challenge: "Developer productivity enhancement through AI assistance",
    keyMetric: { value: 31, label: "Development Speed" },
    icon: Clock,
    color: "from-cyber-purple/20 to-cyber-purple/5"
  },
  {
    id: 6,
    client: "Logistics Company",
    industry: "Transportation",
    challenge: "Route optimization and delivery prediction",
    keyMetric: { value: 28, label: "Fuel Savings" },
    icon: LineChart,
    color: "from-holo-teal/20 to-holo-teal/5"
  }
];

const CaseStudyGrid = () => {
  return (
    <section className="py-16 bg-raiden-black">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center"
        >
          Client Success Stories
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card group h-full relative overflow-hidden transition-all duration-300 hover:shadow-neon-blue">
                <div className={`absolute inset-0 bg-gradient-to-br ${study.color} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}></div>
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-heading text-xl font-semibold mb-1">{study.client}</h3>
                      <p className="text-white/60 text-sm">{study.industry}</p>
                    </div>
                    <div className="p-2 bg-white/5 backdrop-blur-sm rounded-full">
                      <study.icon className="h-6 w-6 text-electric-blue" />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex gap-3 items-center mb-3">
                      <div className="text-3xl font-heading font-bold cyber-text-glow text-electric-blue">
                        {study.keyMetric.value}%
                      </div>
                      <div className="text-sm text-white/60">
                        {study.keyMetric.label}
                      </div>
                    </div>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {study.challenge}
                    </p>
                  </div>
                  
                  <button className="mt-auto flex items-center gap-2 text-electric-blue group-hover:text-cyber-purple transition-colors">
                    <span>Explore Case</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyGrid;
