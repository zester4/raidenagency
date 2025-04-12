
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink } from 'lucide-react';

// Office locations data
const offices = [
  {
    city: "San Francisco",
    country: "USA",
    specialization: "Headquarters & Research",
    address: "101 Market Street, CA 94105",
    timezone: "PST (UTC-8)",
  },
  {
    city: "New York",
    country: "USA",
    specialization: "Enterprise Solutions",
    address: "350 Fifth Avenue, NY 10118",
    timezone: "EST (UTC-5)",
  },
  {
    city: "London",
    country: "UK",
    specialization: "European Operations",
    address: "20 Fenchurch Street, EC3M 3BY",
    timezone: "GMT (UTC+0)",
  },
  {
    city: "Singapore",
    country: "Singapore",
    specialization: "APAC Headquarters",
    address: "1 Raffles Place, 048616",
    timezone: "SGT (UTC+8)",
  },
];

const GlobalOffices = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-neural-network bg-cover bg-center bg-no-repeat opacity-5 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Global Offices</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Visit one of our locations around the world
          </p>
        </motion.div>
        
        {/* Globe Placeholder - would be replaced with an actual 3D globe in production */}
        <motion.div
          className="w-full h-64 md:h-80 mb-16 glass-panel flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-white/50 text-center">
            <p className="text-lg mb-2">Interactive 3D Globe Visualization</p>
            <p className="text-sm">(Placeholder for WebGL/Three.js implementation)</p>
          </div>
        </motion.div>
        
        {/* Office grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offices.map((office, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 hover:border-electric-blue hover:shadow-neon-blue transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index % 2) }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start mb-4">
                <div className="bg-electric-blue/10 p-2 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-electric-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-heading">{office.city}, {office.country}</h3>
                  <p className="text-sm text-cyber-purple">{office.specialization}</p>
                </div>
              </div>
              
              <p className="text-white/70 mb-4">{office.address}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-white/50">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{office.timezone}</span>
                </div>
                
                <button className="text-electric-blue text-sm flex items-center hover:text-electric-blue/80 transition-colors duration-300">
                  View Map
                  <ExternalLink className="h-3 w-3 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalOffices;
