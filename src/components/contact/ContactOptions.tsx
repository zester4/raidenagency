
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';

const contactOptions = [
  { 
    icon: Calendar, 
    title: "Schedule Demo", 
    description: "Book a guided tour of our platform",
    color: "bg-electric-blue/10",
    textColor: "text-electric-blue" 
  },
  { 
    icon: MessageSquare, 
    title: "General Inquiry", 
    description: "Questions about our services",
    color: "bg-cyberpunk-purple/10",
    textColor: "text-cyber-purple" 
  },
  { 
    icon: HelpCircle, 
    title: "Support Request", 
    description: "Get help with existing systems",
    color: "bg-holographic-teal/10",
    textColor: "text-holo-teal" 
  },
  { 
    icon: Mail, 
    title: "Partner Inquiry", 
    description: "Explore collaboration opportunities",
    color: "bg-electric-blue/10",
    textColor: "text-electric-blue" 
  },
  { 
    icon: Phone, 
    title: "Call Us", 
    description: "Speak directly with our team",
    color: "bg-cyberpunk-purple/10",
    textColor: "text-cyber-purple" 
  },
  { 
    icon: MapPin, 
    title: "Visit Us", 
    description: "Find our global office locations",
    color: "bg-holographic-teal/10",
    textColor: "text-holo-teal" 
  },
];

const ContactOptions = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-hex-pattern bg-repeat opacity-5 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Contact Options</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Choose the best way to connect with our team
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {contactOptions.map((option, index) => (
            <motion.div
              key={index}
              className="hexagon group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className={`${option.color} p-4 rounded-lg inline-block mb-4`}>
                  <option.icon className={`h-6 w-6 ${option.textColor}`} />
                </div>
                <h3 className="text-xl font-heading mb-2 group-hover:cyber-text-glow">{option.title}</h3>
                <p className="text-white/70">{option.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactOptions;
