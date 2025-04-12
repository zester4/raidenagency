
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

// Office locations data
const offices = [
  {
    city: "San Francisco",
    country: "USA",
    specialization: "Headquarters & Research",
    address: "101 Market Street, San Francisco, CA 94105",
    timezone: "PST (UTC-8)",
    phone: "+1 (415) 555-0123",
    email: "sf@raidenagents.ai",
    coords: { lat: 37.7749, lng: -122.4194 },
    team: [
      { role: "CEO & Co-founder", name: "Dr. Alexander Chen" },
      { role: "CTO & Co-founder", name: "Dr. Maya Rodriguez" },
      { role: "VP of Research", name: "Dr. James Wilson" }
    ]
  },
  {
    city: "New York",
    country: "USA",
    specialization: "Enterprise Solutions",
    address: "350 Fifth Avenue, New York, NY 10118",
    timezone: "EST (UTC-5)",
    phone: "+1 (212) 555-0123",
    email: "nyc@raidenagents.ai",
    coords: { lat: 40.7128, lng: -74.0060 },
    team: [
      { role: "VP of Enterprise Solutions", name: "Sarah Johnson" },
      { role: "Director of Sales, East Coast", name: "Michael Thompson" }
    ]
  },
  {
    city: "London",
    country: "UK",
    specialization: "European Operations",
    address: "20 Fenchurch Street, London, EC3M 3BY",
    timezone: "GMT (UTC+0)",
    phone: "+44 20 5555 0123",
    email: "london@raidenagents.ai",
    coords: { lat: 51.5074, lng: -0.1278 },
    team: [
      { role: "Managing Director, Europe", name: "Emma Davies" },
      { role: "VP of European Partnerships", name: "Thomas Schmidt" }
    ]
  },
  {
    city: "Singapore",
    country: "Singapore",
    specialization: "APAC Headquarters",
    address: "1 Raffles Place, Singapore 048616",
    timezone: "SGT (UTC+8)",
    phone: "+65 6555 0123",
    email: "singapore@raidenagents.ai",
    coords: { lat: 1.3521, lng: 103.8198 },
    team: [
      { role: "Managing Director, APAC", name: "Li Wei" },
      { role: "Director of Solutions, APAC", name: "Hiroshi Tanaka" }
    ]
  },
  {
    city: "Tokyo",
    country: "Japan",
    specialization: "AI Research & Development",
    address: "Roppongi Hills Mori Tower, Minato, Tokyo 106-6126",
    timezone: "JST (UTC+9)",
    phone: "+81 3 5555 0123",
    email: "tokyo@raidenagents.ai",
    coords: { lat: 35.6762, lng: 139.6503 },
    team: [
      { role: "Director of AI Research", name: "Dr. Akira Nakamura" },
      { role: "Lead AI Engineer", name: "Yuki Sato" }
    ]
  },
  {
    city: "Sydney",
    country: "Australia",
    specialization: "Oceania Solutions",
    address: "1 Macquarie Place, Sydney NSW 2000",
    timezone: "AEST (UTC+10)",
    phone: "+61 2 5555 0123",
    email: "sydney@raidenagents.ai",
    coords: { lat: -33.8688, lng: 151.2093 },
    team: [
      { role: "Director, Australia & New Zealand", name: "Emily Parker" },
      { role: "Solutions Architect", name: "Jack Wilson" }
    ]
  },
];

const Globe = () => (
  <div className="w-full h-full bg-[#070816] rounded-xl overflow-hidden relative">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4/5 h-4/5 rounded-full bg-[#152049] opacity-70 blur-[30px]"></div>
    </div>
    <div className="absolute inset-0">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border border-electric-blue/20 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 border border-electric-blue/15 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 h-2/5 border border-electric-blue/10 rounded-full"></div>
    </div>
    
    {/* Location markers */}
    {offices.map((office, index) => {
      // These are approximations for visual effect only
      const leftPos = `${35 + (office.coords.lng + 180) / 360 * 30}%`;
      const topPos = `${20 + (office.coords.lat + 90) / 180 * 60}%`;
      
      return (
        <div 
          key={index}
          className="absolute w-3 h-3 rounded-full bg-electric-blue animate-pulse"
          style={{ left: leftPos, top: topPos }}
        >
          <div className="absolute -inset-1 rounded-full border border-electric-blue/50 animate-ping"></div>
        </div>
      );
    })}
  </div>
);

const OfficeCard = ({ office, expanded, toggleExpand }) => (
  <motion.div
    className="glass-card p-6 hover:border-electric-blue hover:shadow-neon-blue transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-start mb-4">
      <div className="bg-electric-blue/10 p-2 rounded-lg mr-3">
        <MapPin className="h-5 w-5 text-electric-blue" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-heading">{office.city}, {office.country}</h3>
        <p className="text-sm text-cyber-purple">{office.specialization}</p>
      </div>
      <button 
        className="ml-2 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        onClick={toggleExpand}
      >
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
    
    <p className="text-white/70 mb-4">{office.address}</p>
    
    <div className="flex flex-col space-y-3 mb-4">
      <div className="flex items-center text-sm text-white/70">
        <Clock className="h-4 w-4 mr-2 text-electric-blue" />
        <span>{office.timezone}</span>
      </div>
      <div className="flex items-center text-sm text-white/70">
        <Phone className="h-4 w-4 mr-2 text-electric-blue" />
        <span>{office.phone}</span>
      </div>
      <div className="flex items-center text-sm text-white/70">
        <Mail className="h-4 w-4 mr-2 text-electric-blue" />
        <span>{office.email}</span>
      </div>
    </div>
    
    {expanded && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 pt-4 border-t border-white/10"
      >
        <h4 className="text-sm font-heading mb-3 text-electric-blue">Key Team Members</h4>
        <ul className="space-y-2">
          {office.team.map((member, idx) => (
            <li key={idx} className="text-sm">
              <span className="text-white/90">{member.name}</span>
              <span className="text-white/50 block text-xs">{member.role}</span>
            </li>
          ))}
        </ul>
        
        <button className="text-electric-blue text-sm flex items-center hover:text-electric-blue/80 transition-colors duration-300 mt-4">
          View on Map
          <ExternalLink className="h-3 w-3 ml-1" />
        </button>
      </motion.div>
    )}
  </motion.div>
);

const GlobalOffices = () => {
  const [expandedOffice, setExpandedOffice] = useState<number | null>(null);
  
  const toggleExpand = (index: number) => {
    setExpandedOffice(expandedOffice === index ? null : index);
  };
  
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
            Visit one of our locations around the world or connect with our local teams
          </p>
        </motion.div>
        
        {/* Globe Visualization */}
        <motion.div
          className="w-full h-64 md:h-96 mb-16 glass-panel flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Globe />
        </motion.div>
        
        {/* Office grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map((office, index) => (
            <OfficeCard 
              key={index} 
              office={office} 
              expanded={expandedOffice === index}
              toggleExpand={() => toggleExpand(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalOffices;
