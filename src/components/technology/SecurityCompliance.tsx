
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, FileCheck } from 'lucide-react';

interface SecurityCert {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  details: string[];
}

const securityCerts: SecurityCert[] = [
  {
    id: 'soc2',
    title: 'SOC 2 Type II',
    icon: Shield,
    description: 'Comprehensive audit of security, availability, and confidentiality controls.',
    details: [
      'Annual independent audit',
      'Controls for data protection',
      'Business continuity verification',
      'Incident response procedures'
    ]
  },
  {
    id: 'gdpr',
    title: 'GDPR Compliant',
    icon: FileCheck,
    description: 'Full compliance with European data protection regulations.',
    details: [
      'Data processing agreements',
      'Right to erasure support',
      'Data minimization practices',
      'Data protection impact assessments'
    ]
  },
  {
    id: 'hipaa',
    title: 'HIPAA Ready',
    icon: Database,
    description: 'Meets healthcare data protection requirements.',
    details: [
      'PHI handling protocols',
      'Business associate agreements',
      'Access control systems',
      'Audit logging for compliance'
    ]
  },
  {
    id: 'encryption',
    title: 'End-to-End Encryption',
    icon: Lock,
    description: 'Multi-layer encryption for data in transit and at rest.',
    details: [
      'AES-256 encryption',
      'TLS 1.3 for all connections',
      'Key rotation policies',
      'Zero knowledge architecture'
    ]
  },
  {
    id: 'iso27001',
    title: 'ISO 27001',
    icon: Shield,
    description: 'Certified information security management system.',
    details: [
      'Risk management framework',
      'Security policy implementation',
      'Asset management protocols',
      'Regular security assessments'
    ]
  },
  {
    id: 'penetration',
    title: 'Penetration Testing',
    icon: Shield,
    description: 'Regular security assessment by independent experts.',
    details: [
      'Quarterly security testing',
      'White-box and black-box methods',
      'Vulnerability remediation process',
      'Bug bounty program'
    ]
  }
];

const SecurityCompliance = () => {
  const [activeHex, setActiveHex] = useState<string | null>(null);
  
  return (
    <section className="py-24 bg-raiden-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,103,255,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 cyber-purple-glow">
            Security & Compliance
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Enterprise-grade protection with comprehensive compliance certifications
          </p>
        </div>
        
        <div className="mb-20">
          {/* Holographic security shield visualization */}
          <div className="relative mx-auto w-64 h-64 mb-12">
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-cyber-purple/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.div 
              className="absolute inset-4 rounded-full border-2 border-cyber-purple/40"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.div 
              className="absolute inset-8 rounded-full border-2 border-cyber-purple/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Shield className="h-24 w-24 text-cyber-purple" />
            </motion.div>
            
            {/* Animated particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-shield-${i}`}
                className="absolute w-2 h-2 rounded-full bg-cyber-purple/70"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Hexagonal certification grid */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {securityCerts.map((cert, index) => (
              <motion.div
                key={cert.id}
                className={`hexagon w-32 h-32 md:w-44 md:h-44 flex items-center justify-center cursor-pointer ${
                  activeHex === cert.id ? 'shadow-neon-purple border-cyber-purple' : ''
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveHex(activeHex === cert.id ? null : cert.id)}
              >
                <div className="p-4 text-center">
                  <cert.icon className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 text-cyber-purple" />
                  <h3 className="text-sm md:text-base font-heading text-white">{cert.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Expanded certification details */}
        {activeHex && (
          <motion.div
            className="glass-panel p-6 rounded-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-cyber-purple/20 p-3 rounded-lg">
                {React.createElement(
                  securityCerts.find(cert => cert.id === activeHex)?.icon || Shield,
                  { className: "h-6 w-6 text-cyber-purple" }
                )}
              </div>
              <div>
                <h3 className="text-xl font-heading text-white mb-2">
                  {securityCerts.find(cert => cert.id === activeHex)?.title}
                </h3>
                <p className="text-white/70 mb-4">
                  {securityCerts.find(cert => cert.id === activeHex)?.description}
                </p>
                <ul className="space-y-2">
                  {securityCerts.find(cert => cert.id === activeHex)?.details.map((detail, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <span className="text-cyber-purple mr-2">•</span>
                      <span className="text-white/80">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Data protection section */}
        <div className="mt-24">
          <h3 className="text-2xl font-heading text-center mb-10 text-white">
            Data Protection Framework
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <div className="bg-cyber-purple/20 p-3 rounded-lg w-fit mb-4">
                <Database className="h-6 w-6 text-cyber-purple" />
              </div>
              <h4 className="text-lg font-heading text-white mb-2">Data Encryption</h4>
              <p className="text-white/70 mb-4">
                Multi-layered encryption approach securing data at rest and in transit.
              </p>
              <ul className="text-white/60 space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> AES-256 for stored data
                </li>
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> TLS 1.3 for all communications
                </li>
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> Key management service
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-6">
              <div className="bg-cyber-purple/20 p-3 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6 text-cyber-purple" />
              </div>
              <h4 className="text-lg font-heading text-white mb-2">Access Control</h4>
              <p className="text-white/70 mb-4">
                Fine-grained permission system with strong authentication requirements.
              </p>
              <ul className="text-white/60 space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> Role-based access controls
                </li>
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> Multi-factor authentication
                </li>
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> Just-in-time access provisioning
                </li>
              </ul>
            </div>
            
            <div className="glass-card p-6">
              <div className="bg-cyber-purple/20 p-3 rounded-lg w-fit mb-4">
                <FileCheck className="h-6 w-6 text-cyber-purple" />
              </div>
              <h4 className="text-lg font-heading text-white mb-2">Compliance Controls</h4>
              <p className="text-white/70 mb-4">
                Comprehensive audit and reporting system for regulatory requirements.
              </p>
              <ul className="text-white/60 space-y-1 text-sm">
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> Detailed activity logging
                </li>
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> Compliance reporting dashboards
                </li>
                <li className="flex items-start">
                  <span className="text-cyber-purple mr-2">•</span> Data residency controls
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;
