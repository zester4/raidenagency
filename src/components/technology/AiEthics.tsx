
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Eye, Scale, Lightbulb, Workflow } from 'lucide-react';

interface EthicalPrinciple {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  example: string;
}

const ethicalPrinciples: EthicalPrinciple[] = [
  {
    id: 'fairness',
    title: 'Fairness & Equality',
    icon: Scale,
    description: 'Ensuring our AI systems operate without bias and provide equal treatment to all users regardless of background.',
    example: 'Our debiasing pipeline identifies and mitigates potential biases in training data before deployment.'
  },
  {
    id: 'transparency',
    title: 'Transparency',
    icon: Eye,
    description: 'Providing clear explanations of how our AI makes decisions and processes information.',
    example: 'Every agent response includes an explanation feature that reveals reasoning patterns and information sources.'
  },
  {
    id: 'privacy',
    title: 'Privacy Protection',
    icon: Shield,
    description: 'Safeguarding user data and ensuring appropriate consent for all data processing activities.',
    example: 'User data is processed with privacy-preserving techniques and minimized to essential information only.'
  },
  {
    id: 'human',
    title: 'Human Oversight',
    icon: Users,
    description: 'Maintaining human supervision and intervention capabilities for all critical AI operations.',
    example: 'Human review workflows are integrated for high-risk decisions with clear escalation paths.'
  },
  {
    id: 'governance',
    title: 'Ethical Governance',
    icon: Workflow,
    description: 'Implementing robust governance frameworks to ensure ethical compliance throughout our systems.',
    example: 'Our Ethics Committee reviews all new agent deployments against our ethical principles.'
  },
  {
    id: 'innovation',
    title: 'Responsible Innovation',
    icon: Lightbulb,
    description: 'Advancing AI capabilities while proactively identifying and addressing potential risks.',
    example: 'Our research team conducts impact assessments before implementing new capabilities.'
  }
];

const AiEthics = () => {
  const [activePrinciple, setActivePrinciple] = useState<string | null>(null);
  
  return (
    <section className="py-24 bg-raiden-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(32,227,178,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 cyber-teal-glow">
            AI Ethics Framework
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our comprehensive approach to responsible AI development and deployment
          </p>
        </div>
        
        {/* Circular principles visualization */}
        <div className="relative mx-auto mb-24 hidden md:block">
          <div className="relative w-96 h-96 mx-auto">
            {/* Center node */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-24 h-24 -mt-12 -ml-12 bg-raiden-black border-2 border-holo-teal/50 rounded-full flex items-center justify-center z-20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-holo-teal font-heading text-sm text-center">Ethics<br/>Framework</p>
            </motion.div>
            
            {/* Principle nodes */}
            {ethicalPrinciples.map((principle, index) => {
              const angle = (index * 60) * (Math.PI / 180);
              const x = 150 * Math.cos(angle);
              const y = 150 * Math.sin(angle);
              
              return (
                <React.Fragment key={principle.id}>
                  {/* Connection line */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 h-0.5 bg-holo-teal/30 origin-left z-10"
                    style={{
                      width: '150px',
                      transform: `translate(-50%, -50%) rotate(${angle * (180 / Math.PI)}deg)`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                  />
                  
                  {/* Principle node */}
                  <motion.div
                    className={`absolute w-24 h-24 -mt-12 -ml-12 glass-card rounded-full flex items-center justify-center cursor-pointer z-20 ${
                      activePrinciple === principle.id ? 'border-holo-teal shadow-neon-teal' : 'border-holo-teal/30'
                    }`}
                    style={{
                      top: `calc(50% + ${y}px)`,
                      left: `calc(50% + ${x}px)`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setActivePrinciple(activePrinciple === principle.id ? null : principle.id)}
                  >
                    <div className="text-center">
                      <principle.icon className="h-6 w-6 mx-auto mb-1 text-holo-teal" />
                      <p className="text-xs text-white">{principle.title}</p>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
        {/* Mobile-friendly principles grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16 md:hidden">
          {ethicalPrinciples.map((principle) => (
            <motion.div
              key={principle.id}
              className={`glass-card p-4 cursor-pointer ${
                activePrinciple === principle.id ? 'border-holo-teal shadow-neon-teal' : 'border-holo-teal/30'
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActivePrinciple(activePrinciple === principle.id ? null : principle.id)}
            >
              <div className="flex flex-col items-center text-center">
                <principle.icon className="h-8 w-8 mb-2 text-holo-teal" />
                <p className="text-sm text-white">{principle.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Principle details */}
        {activePrinciple && (
          <motion.div
            className="glass-panel p-6 rounded-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-holo-teal/20 p-3 rounded-lg">
                {React.createElement(
                  ethicalPrinciples.find(p => p.id === activePrinciple)?.icon || Shield,
                  { className: "h-6 w-6 text-holo-teal" }
                )}
              </div>
              <div>
                <h3 className="text-xl font-heading text-white mb-2">
                  {ethicalPrinciples.find(p => p.id === activePrinciple)?.title}
                </h3>
                <p className="text-white/70 mb-4">
                  {ethicalPrinciples.find(p => p.id === activePrinciple)?.description}
                </p>
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="text-holo-teal text-sm font-mono mb-2">Practical Example</h4>
                  <p className="text-white/80 text-sm">
                    {ethicalPrinciples.find(p => p.id === activePrinciple)?.example}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Transparency Tools */}
        <div className="mt-24">
          <h3 className="text-2xl font-heading text-center mb-10 text-white">
            Transparency Tools
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <div className="bg-holo-teal/20 p-3 rounded-lg w-fit mb-4">
                <Eye className="h-6 w-6 text-holo-teal" />
              </div>
              <h4 className="text-lg font-heading text-white mb-2">Decision Explanation</h4>
              <p className="text-white/70 mb-4">
                Tools for understanding how and why AI decisions are made.
              </p>
              <ul className="text-white/60 space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Information source tracking
                </li>
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Confidence level indicators
                </li>
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Alternative option presentation
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-6">
              <div className="bg-holo-teal/20 p-3 rounded-lg w-fit mb-4">
                <Scale className="h-6 w-6 text-holo-teal" />
              </div>
              <h4 className="text-lg font-heading text-white mb-2">Bias Detection</h4>
              <p className="text-white/70 mb-4">
                Systems for identifying and mitigating potential biases.
              </p>
              <ul className="text-white/60 space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Demographic performance monitoring
                </li>
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Language bias detection
                </li>
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Proactive mitigation techniques
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-6">
              <div className="bg-holo-teal/20 p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-holo-teal" />
              </div>
              <h4 className="text-lg font-heading text-white mb-2">Human Oversight</h4>
              <p className="text-white/70 mb-4">
                Integration points for human review and intervention.
              </p>
              <ul className="text-white/60 space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Review workflows for critical decisions
                </li>
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Escalation paths for complex cases
                </li>
                <li className="flex items-start">
                  <span className="text-holo-teal mr-2">•</span> Approval thresholds for sensitive actions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiEthics;
