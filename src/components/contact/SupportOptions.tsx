
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MessageCircle, HeadphonesIcon, Users } from 'lucide-react';

const supportTiers = [
  {
    icon: BookOpen,
    title: "Self-Service",
    description: "Access our comprehensive knowledge base, tutorials, and guides.",
    features: ["24/7 Documentation", "Video Tutorials", "Community Forums"],
    color: "bg-white/10",
    textColor: "text-white"
  },
  {
    icon: MessageCircle,
    title: "AI-Powered Support",
    description: "Get immediate assistance from our AI support system.",
    features: ["Instant Responses", "24/7 Availability", "Smart Issue Detection"],
    color: "bg-electric-blue/10",
    textColor: "text-electric-blue"
  },
  {
    icon: HeadphonesIcon,
    title: "Technical Support",
    description: "Direct access to our technical team for complex issues.",
    features: ["Dedicated Engineers", "Advanced Troubleshooting", "Priority Queue"],
    color: "bg-cyber-purple/10",
    textColor: "text-cyber-purple"
  },
  {
    icon: Users,
    title: "Strategic Support",
    description: "Personalized support from your dedicated account manager.",
    features: ["Business Consulting", "Implementation Support", "Quarterly Reviews"],
    color: "bg-holographic-teal/10",
    textColor: "text-holo-teal"
  }
];

const SupportOptions = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-10 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Support Options</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Multiple tiers of support to meet your needs
          </p>
        </motion.div>
        
        {/* System status */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-panel p-5 rounded-xl flex flex-col md:flex-row justify-between items-center mb-16"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-3 w-3 rounded-full bg-holographic-teal mr-2 animate-pulse"></div>
            <span className="text-white/80">All Systems Operational</span>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-xs text-white/50 mb-1">Avg. Response Time</p>
              <p className="text-xl font-heading text-electric-blue">3.2 hrs</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-white/50 mb-1">Satisfaction Rate</p>
              <p className="text-xl font-heading text-holographic-teal">98.5%</p>
            </div>
          </div>
        </motion.div>
        
        {/* Support tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {supportTiers.map((tier, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 hover:border-electric-blue hover:shadow-neon-blue transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`${tier.color} p-4 rounded-lg inline-block mb-4`}>
                <tier.icon className={`h-6 w-6 ${tier.textColor}`} />
              </div>
              <h3 className="text-xl font-heading mb-2">{tier.title}</h3>
              <p className="text-white/70 text-sm mb-4">{tier.description}</p>
              
              <ul className="space-y-2">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <div className="h-1.5 w-1.5 bg-electric-blue rounded-full mr-2"></div>
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportOptions;
