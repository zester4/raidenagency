
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Team members data
const teamMembers = [
  {
    name: "Alex Chen",
    role: "Chief Executive Officer",
    department: "Executive",
    image: "/placeholder.svg", // Replace with actual image paths
    bio: "Visionary AI researcher with 15+ years experience building autonomous systems. Previously led AI initiatives at leading tech companies."
  },
  {
    name: "Sophia Rodriguez",
    role: "Chief Technical Officer",
    department: "Executive",
    image: "/placeholder.svg",
    bio: "Former ML research lead with expertise in multi-agent systems and distributed intelligence architectures."
  },
  {
    name: "Raj Patel",
    role: "VP of Research",
    department: "Research",
    image: "/placeholder.svg",
    bio: "PhD in Computer Science specializing in reinforcement learning and complex decision systems."
  },
  {
    name: "Maria Kim",
    role: "VP of Engineering",
    department: "Engineering",
    image: "/placeholder.svg",
    bio: "20+ years experience scaling enterprise platforms with focus on resilient distributed systems."
  },
  {
    name: "David Okafor",
    role: "Chief Product Officer",
    department: "Product",
    image: "/placeholder.svg",
    bio: "Product strategist with background in enterprise AI implementation and user-centered design."
  },
  {
    name: "Leila Nakamura",
    role: "Chief AI Ethics Officer",
    department: "Ethics",
    image: "/placeholder.svg",
    bio: "Leading expert in responsible AI with background in philosophy and computational ethics."
  },
  {
    name: "Thomas Weber",
    role: "VP of Client Solutions",
    department: "Solutions",
    image: "/placeholder.svg",
    bio: "Enterprise transformation specialist with deep expertise in AI integration strategies."
  },
  {
    name: "Aisha Hassan",
    role: "Director of UX",
    department: "Design",
    image: "/placeholder.svg",
    bio: "Interface designer specializing in human-AI collaboration systems and intuitive workflows."
  }
];

// Department filters
const departments = ["All", "Executive", "Research", "Engineering", "Product", "Ethics", "Solutions", "Design"];

const TeamSection = () => {
  const [filter, setFilter] = useState("All");
  const isMobile = useIsMobile();
  
  const filteredTeam = filter === "All" 
    ? teamMembers 
    : teamMembers.filter(member => member.department === filter);
  
  return (
    <section className="py-24 relative overflow-hidden" id="team">
      <div className="absolute inset-0 bg-neural-network bg-cover bg-center bg-no-repeat opacity-5 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Our Team</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Meet the minds behind our intelligent agent technology
          </p>
        </motion.div>
        
        {/* Department filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {departments.map((dept, index) => (
            <motion.button
              key={index}
              className={`px-4 py-2 rounded-full glass-card border transition-all duration-300 text-sm ${
                filter === dept 
                  ? 'border-electric-blue text-electric-blue shadow-neon-blue' 
                  : 'border-white/10 text-white/70 hover:border-white/30'
              }`}
              onClick={() => setFilter(dept)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {dept}
            </motion.button>
          ))}
        </div>
        
        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTeam.map((member, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index % 4) }}
              viewport={{ once: true }}
            >
              <div className="hexagon overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:border-electric-blue group-hover:shadow-neon-blue">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-white/20 group-hover:border-electric-blue transition-all duration-300">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-heading mb-1 group-hover:cyber-text-glow text-center">{member.name}</h3>
                  <p className="text-sm text-electric-blue mb-2">{member.role}</p>
                  <p className="text-xs text-white/70 text-center line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
