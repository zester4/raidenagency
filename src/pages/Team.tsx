
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Users, 
  Code, 
  BrainCircuit, 
  Shield, 
  HelpCircle, 
  Award, 
  Lightbulb, 
  Github, 
  Linkedin, 
  Twitter,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  bio: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
}

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  members: TeamMember[];
}

const Team = () => {
  // Sample team members data
  const departments: Department[] = [
    {
      id: 'leadership',
      name: 'Leadership',
      icon: <Award className="h-6 w-6 text-electric-blue" />,
      members: [
        {
          id: 'alex-chen',
          name: 'Alex Chen',
          role: 'CEO & Founder',
          imageSrc: 'https://randomuser.me/api/portraits/men/32.jpg',
          bio: 'Former AI researcher at DeepMind with a passion for creating intelligent systems that augment human capabilities. Founded Raiden Agents to bring enterprise-grade AI agents to businesses of all sizes.',
          social: {
            linkedin: '#',
            twitter: '#',
            github: '#',
            email: 'alex@raidenagents.com'
          }
        },
        {
          id: 'sarah-johnson',
          name: 'Sarah Johnson',
          role: 'COO',
          imageSrc: 'https://randomuser.me/api/portraits/women/44.jpg',
          bio: 'Operations expert with 15+ years experience scaling technology companies. Previously led operations at several successful AI startups before joining Raiden to build the infrastructure for the next generation of AI agents.',
          social: {
            linkedin: '#',
            twitter: '#',
            email: 'sarah@raidenagents.com'
          }
        },
        {
          id: 'michael-rodriguez',
          name: 'Michael Rodriguez',
          role: 'CTO',
          imageSrc: 'https://randomuser.me/api/portraits/men/68.jpg',
          bio: 'Computer scientist and machine learning researcher with a background in developing large language model applications. Leads Raiden's technical strategy and engineering teams.',
          social: {
            linkedin: '#',
            github: '#',
            twitter: '#',
            email: 'michael@raidenagents.com'
          }
        }
      ]
    },
    {
      id: 'engineering',
      name: 'Engineering',
      icon: <Code className="h-6 w-6 text-cyberpunk-purple" />,
      members: [
        {
          id: 'james-wilson',
          name: 'James Wilson',
          role: 'Lead Engineer, Agent Architecture',
          imageSrc: 'https://randomuser.me/api/portraits/men/22.jpg',
          bio: 'Specializes in designing complex AI systems and agent architecture. Previously worked on developing autonomous systems for robotics applications.',
          social: {
            github: '#',
            linkedin: '#'
          }
        },
        {
          id: 'aisha-patel',
          name: 'Aisha Patel',
          role: 'Senior Engineer, NLP',
          imageSrc: 'https://randomuser.me/api/portraits/women/66.jpg',
          bio: 'Natural Language Processing expert with a focus on contextual understanding and semantic analysis. Leads the development of Raiden's language processing capabilities.',
          social: {
            github: '#',
            linkedin: '#',
            twitter: '#'
          }
        },
        {
          id: 'david-kim',
          name: 'David Kim',
          role: 'Frontend Lead',
          imageSrc: 'https://randomuser.me/api/portraits/men/51.jpg',
          bio: 'User experience specialist focused on creating intuitive interfaces for complex AI systems. Leads the development of Raiden's agent builder interface.',
          social: {
            github: '#',
            linkedin: '#'
          }
        }
      ]
    },
    {
      id: 'ai-research',
      name: 'AI Research',
      icon: <BrainCircuit className="h-6 w-6 text-holographic-teal" />,
      members: [
        {
          id: 'elena-schmidt',
          name: 'Dr. Elena Schmidt',
          role: 'Head of AI Research',
          imageSrc: 'https://randomuser.me/api/portraits/women/33.jpg',
          bio: 'PhD in Computer Science specializing in multi-agent systems and reinforcement learning. Leads Raiden's research into next-generation agent capabilities.',
          social: {
            linkedin: '#',
            github: '#'
          }
        },
        {
          id: 'marcus-jefferson',
          name: 'Dr. Marcus Jefferson',
          role: 'Senior AI Researcher',
          imageSrc: 'https://randomuser.me/api/portraits/men/41.jpg',
          bio: 'Specializes in agent reasoning and decision-making systems. Published author of numerous papers on AI alignment and safe deployment of autonomous systems.',
          social: {
            linkedin: '#',
            github: '#',
            twitter: '#'
          }
        }
      ]
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      icon: <Shield className="h-6 w-6 text-red-400" />,
      members: [
        {
          id: 'nicole-wong',
          name: 'Nicole Wong',
          role: 'Security Director',
          imageSrc: 'https://randomuser.me/api/portraits/women/29.jpg',
          bio: 'Cybersecurity expert with experience in securing AI systems against adversarial attacks. Ensures all Raiden agents meet enterprise security standards.',
          social: {
            linkedin: '#'
          }
        }
      ]
    },
    {
      id: 'customer-success',
      name: 'Customer Success',
      icon: <HelpCircle className="h-6 w-6 text-amber-400" />,
      members: [
        {
          id: 'carlos-mendez',
          name: 'Carlos Mendez',
          role: 'Head of Customer Success',
          imageSrc: 'https://randomuser.me/api/portraits/men/55.jpg',
          bio: 'Passionate about helping customers achieve their goals with AI. Leads the team responsible for customer onboarding, training, and ongoing support.',
          social: {
            linkedin: '#',
            email: 'carlos@raidenagents.com'
          }
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div 
        className="absolute inset-0 bg-[url(/neural-network.svg)] bg-no-repeat bg-cover opacity-10 pointer-events-none"
        style={{ backgroundPosition: 'center 20%' }}
      />
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24 mt-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-full mb-4">
            <Users className="w-5 h-5 text-electric-blue mr-2" />
            <span className="text-gray-300">Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Meet the <span className="text-gradient">Minds</span> Behind Raiden</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We're a diverse team of AI researchers, engineers, and industry experts united by our mission to build the next generation of AI agents.
          </p>
        </div>
        
        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-heading text-center mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8 flex flex-col items-center text-center hover:border-electric-blue/50 transition-all">
              <div className="p-4 rounded-full bg-electric-blue/10 mb-6">
                <Lightbulb className="h-8 w-8 text-electric-blue" />
              </div>
              <h3 className="text-xl font-medium mb-3">Innovation First</h3>
              <p className="text-gray-400">
                We constantly push the boundaries of what AI agents can do, investing heavily in research and development to stay at the cutting edge.
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8 flex flex-col items-center text-center hover:border-electric-blue/50 transition-all">
              <div className="p-4 rounded-full bg-cyberpunk-purple/10 mb-6">
                <Shield className="h-8 w-8 text-cyberpunk-purple" />
              </div>
              <h3 className="text-xl font-medium mb-3">Responsible AI</h3>
              <p className="text-gray-400">
                We design our agents with security, ethics, and transparency at the core, ensuring safe and responsible AI deployment.
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8 flex flex-col items-center text-center hover:border-electric-blue/50 transition-all">
              <div className="p-4 rounded-full bg-holographic-teal/10 mb-6">
                <Users className="h-8 w-8 text-holographic-teal" />
              </div>
              <h3 className="text-xl font-medium mb-3">Customer Obsession</h3>
              <p className="text-gray-400">
                We build for our users, focusing on creating intuitive tools that empower them to achieve their goals with AI.
              </p>
            </div>
          </div>
        </div>
        
        {/* Team Members by Department */}
        {departments.map(department => (
          <div key={department.id} className="mb-20">
            <div className="flex items-center mb-8">
              <div className="p-2 rounded-md bg-black/50 border border-gray-800 mr-4">
                {department.icon}
              </div>
              <h2 className="text-2xl font-heading">{department.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {department.members.map(member => (
                <div 
                  key={member.id}
                  className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-electric-blue/50 transition-all"
                >
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={member.imageSrc} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                    <p className="text-electric-blue mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm mb-4">{member.bio}</p>
                    
                    <div className="flex space-x-2">
                      {member.social.linkedin && (
                        <a 
                          href={member.social.linkedin} 
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Linkedin className="h-4 w-4 text-gray-400" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a 
                          href={member.social.twitter} 
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Twitter className="h-4 w-4 text-gray-400" />
                        </a>
                      )}
                      {member.social.github && (
                        <a 
                          href={member.social.github} 
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Github className="h-4 w-4 text-gray-400" />
                        </a>
                      )}
                      {member.social.email && (
                        <a 
                          href={`mailto:${member.social.email}`} 
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Mail className="h-4 w-4 text-gray-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Join Our Team CTA */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-black/70 to-black/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url(/circuit-board.svg)] bg-cover opacity-20" />
            
            <h2 className="text-3xl md:text-4xl font-heading mb-4 relative z-10">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-400 mb-8 relative z-10">
              We're always looking for passionate individuals to help us build the future of AI agents.
            </p>
            
            <Button 
              className="bg-gradient-to-r from-electric-blue to-cyberpunk-purple hover:from-electric-blue/90 hover:to-cyberpunk-purple/90 text-lg px-8 py-6 h-auto relative z-10"
            >
              View Open Positions
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Team;
