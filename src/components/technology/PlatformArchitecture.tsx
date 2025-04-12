
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Brain, MessageSquare, ApiIcon, ShieldCheck } from 'lucide-react';

interface LayerComponent {
  id: string;
  title: string;
  description: string;
  specs: string[];
  benefits: string[];
}

interface TechLayer {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  components: LayerComponent[];
  color: string;
}

const techLayers: TechLayer[] = [
  {
    id: 'foundation',
    title: 'Foundation Layer',
    icon: Server,
    color: 'from-electric-blue/20 to-transparent',
    description: 'Enterprise-grade infrastructure supporting reliability, security, and global scaling capabilities.',
    components: [
      {
        id: 'cloud-infra',
        title: 'Cloud Infrastructure',
        description: 'Distributed cloud architecture with multi-region failover support.',
        specs: ['99.99% uptime SLA', 'Auto-scaling compute resources', 'Global CDN integration'],
        benefits: ['Reliable service even during peak demand', 'Cost optimization through dynamic scaling', 'Low-latency responses worldwide']
      },
      {
        id: 'security-foundation',
        title: 'Security Framework',
        description: 'Multi-layered security approach protecting all infrastructure components.',
        specs: ['Encrypted data storage & transmission', 'Real-time threat monitoring', 'Regular penetration testing'],
        benefits: ['Enterprise-grade data protection', 'Regulatory compliance', 'Protection against emerging threats']
      },
      {
        id: 'scaling-engine',
        title: 'Scaling Engine',
        description: 'Intelligent resource allocation optimizing for performance and cost.',
        specs: ['Predictive scaling algorithms', 'Cross-region load balancing', 'Resource usage analytics'],
        benefits: ['Handles viral scaling events', 'Optimized operating costs', 'Consistent performance globally']
      }
    ]
  },
  {
    id: 'intelligence',
    title: 'Intelligence Core',
    icon: Brain,
    color: 'from-cyber-purple/20 to-transparent',
    description: 'Advanced neural networks and ML systems providing reasoning, learning, and problem-solving capabilities.',
    components: [
      {
        id: 'ml-models',
        title: 'ML Model Architecture',
        description: 'Ensemble of specialized models optimized for different cognitive tasks.',
        specs: ['Transformer-based architecture', 'Multi-modal processing capabilities', 'Continuous learning framework'],
        benefits: ['Human-like reasoning abilities', 'Adapts to unique business contexts', 'Improves over time with usage']
      },
      {
        id: 'training-systems',
        title: 'Training Systems',
        description: 'Custom infrastructure for efficient model training and fine-tuning.',
        specs: ['Distributed training across GPU clusters', 'Custom dataset curation tools', 'Reinforcement learning framework'],
        benefits: ['Rapid adaptation to new domains', 'Lower energy consumption', 'Specialized knowledge integration']
      },
      {
        id: 'reasoning-engines',
        title: 'Reasoning Engines',
        description: 'Symbolic and neural reasoning components that handle complex logic.',
        specs: ['Symbolic reasoning integration', 'Uncertainty modeling', 'Explainable AI components'],
        benefits: ['Handles complex business logic', 'Provides reasoning transparency', 'Reduces decision errors']
      }
    ]
  },
  {
    id: 'interaction',
    title: 'Interaction Layer',
    icon: MessageSquare,
    color: 'from-holo-teal/20 to-transparent',
    description: 'Advanced natural language processing and contextual understanding enabling human-like conversations.',
    components: [
      {
        id: 'nlp',
        title: 'NLP Components',
        description: 'Language understanding and generation modules optimized for business contexts.',
        specs: ['Entity recognition for business domains', 'Multi-lingual support', 'Tone and style adaptation'],
        benefits: ['Natural conversation flow', 'Global language support', 'Brand-aligned communication']
      },
      {
        id: 'context',
        title: 'Context Management',
        description: 'Long-term memory systems maintaining conversation coherence and user history.',
        specs: ['Multi-session memory architecture', 'User preference learning', 'Conversation state tracking'],
        benefits: ['Remembers past interactions', 'Personalized user experience', 'Reduced repetition for users']
      },
      {
        id: 'response',
        title: 'Response Generation',
        description: 'Advanced content creation optimized for accuracy and engagement.',
        specs: ['Fact-verification system', 'Multi-modal response capabilities', 'Adaptive response length'],
        benefits: ['Accurate information delivery', 'Engaging user experiences', 'Format flexibility for different channels']
      }
    ]
  },
  {
    id: 'integration',
    title: 'Integration Layer',
    icon: ApiIcon,
    color: 'from-electric-blue/20 to-transparent',
    description: 'Seamless connections to enterprise systems through standardized APIs and custom connectors.',
    components: [
      {
        id: 'apis',
        title: 'API Ecosystem',
        description: 'Comprehensive API suite for integration with any business system.',
        specs: ['RESTful and GraphQL interfaces', 'Real-time webhooks', 'SDK support for major platforms'],
        benefits: ['Easy integration with existing systems', 'Flexible implementation options', 'Developer-friendly documentation']
      },
      {
        id: 'connectors',
        title: 'Enterprise Connectors',
        description: 'Pre-built integrations for common enterprise platforms.',
        specs: ['200+ pre-built connectors', 'Custom connector framework', 'Bi-directional data sync'],
        benefits: ['Rapid implementation timeframes', 'Reduced integration costs', 'Reliable data exchange']
      },
      {
        id: 'tools',
        title: 'Custom Tools',
        description: 'Framework for developing specialized capabilities for unique use cases.',
        specs: ['Tool definition API', 'Tool marketplace', 'Version control and testing framework'],
        benefits: ['Extends agent capabilities', 'Access to community innovations', 'Specialized functionality development']
      }
    ]
  },
  {
    id: 'governance',
    title: 'Governance Layer',
    icon: ShieldCheck,
    color: 'from-cyber-purple/20 to-transparent',
    description: 'Comprehensive controls ensuring compliance, ethical operation, and performance monitoring.',
    components: [
      {
        id: 'monitoring',
        title: 'Monitoring Systems',
        description: 'Real-time performance and usage analytics across all components.',
        specs: ['Real-time performance dashboards', 'Anomaly detection', 'Custom alert configurations'],
        benefits: ['Proactive issue identification', 'System optimization opportunities', 'Complete operational visibility']
      },
      {
        id: 'ethics',
        title: 'Ethics Framework',
        description: 'Ensures AI operates within defined ethical boundaries.',
        specs: ['Content filtering systems', 'Bias detection algorithms', 'Regular ethical audits'],
        benefits: ['Aligned with organizational values', 'Reduced reputation risks', 'Trustworthy AI systems']
      },
      {
        id: 'compliance',
        title: 'Compliance Controls',
        description: 'Tools ensuring adherence to regulatory requirements across industries.',
        specs: ['Audit logging and reporting', 'Compliance certification framework', 'Geographic data controls'],
        benefits: ['Meets regulatory requirements', 'Simplifies audit processes', 'Enables operation in regulated industries']
      }
    ]
  }
];

const PlatformArchitecture = () => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  
  const handleLayerClick = (layerId: string) => {
    if (activeLayer === layerId) {
      setActiveLayer(null);
      setActiveComponent(null);
    } else {
      setActiveLayer(layerId);
      setActiveComponent(null);
    }
  };
  
  const handleComponentClick = (componentId: string) => {
    if (activeComponent === componentId) {
      setActiveComponent(null);
    } else {
      setActiveComponent(componentId);
    }
  };
  
  return (
    <section className="py-24 bg-raiden-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 cyber-text-glow">
            Platform Architecture
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our modular design ensures enterprise-grade reliability with cutting-edge AI capabilities
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-xl relative overflow-hidden">
          {/* Main 3D visualization placeholder */}
          <div className="relative h-64 mb-12 glass-card bg-raiden-black/50 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/50 text-sm mb-2">Interactive 3D Model</p>
                <p className="text-white/30 text-xs">Click on layers below to explore details</p>
              </div>
            </div>
            
            {activeLayer && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center max-w-md">
                  <h3 className="text-electric-blue font-heading text-xl mb-2">
                    {techLayers.find(layer => layer.id === activeLayer)?.title}
                  </h3>
                  <p className="text-white/70">
                    {techLayers.find(layer => layer.id === activeLayer)?.description}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Layer selection */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {techLayers.map((layer) => (
              <motion.div
                key={layer.id}
                className={`glass-card p-4 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  activeLayer === layer.id ? 'border-electric-blue shadow-neon-blue' : 'hover:border-electric-blue/30'
                }`}
                onClick={() => handleLayerClick(layer.id)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${layer.color} opacity-20`}></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="bg-white/10 p-3 rounded-full mb-3">
                    <layer.icon className="h-6 w-6 text-electric-blue" />
                  </div>
                  <h3 className="font-heading text-white text-lg mb-1">{layer.title}</h3>
                  <p className="text-white/60 text-sm line-clamp-2">{layer.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Component details (visible when layer is selected) */}
          {activeLayer && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-heading mb-6 text-electric-blue">
                {techLayers.find(layer => layer.id === activeLayer)?.title} Components
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {techLayers
                  .find(layer => layer.id === activeLayer)
                  ?.components.map((component) => (
                    <motion.div
                      key={component.id}
                      className={`glass-card p-5 cursor-pointer transition-all duration-300 ${
                        activeComponent === component.id ? 'border-electric-blue shadow-neon-blue' : 'hover:border-electric-blue/30'
                      }`}
                      onClick={() => handleComponentClick(component.id)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-heading text-white text-lg mb-2">{component.title}</h4>
                      <p className="text-white/60 text-sm mb-4">{component.description}</p>
                      
                      {activeComponent === component.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <div className="mb-4">
                            <h5 className="text-electric-blue text-sm font-mono mb-2">Technical Specifications</h5>
                            <ul className="text-white/70 text-sm space-y-1">
                              {component.specs.map((spec, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-electric-blue mr-2">•</span> {spec}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-cyber-purple text-sm font-mono mb-2">Business Benefits</h5>
                            <ul className="text-white/70 text-sm space-y-1">
                              {component.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-cyber-purple mr-2">•</span> {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlatformArchitecture;
