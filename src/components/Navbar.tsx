
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  LayoutDashboard, 
  Bot, 
  ChevronDown, 
  Menu, 
  X,
  Sparkles,
  BarChart3,
  Users
} from 'lucide-react';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    {
      title: "Platform",
      href: "/services",
      children: [
        {
          title: "Agent Builder",
          href: "/services#agent-builder",
          description: "Design and deploy custom AI agents for your business",
          icon: <Bot className="h-5 w-5 text-electric-blue" />,
        },
        {
          title: "Knowledge Base",
          href: "/services#knowledge-base",
          description: "Connect your documents and data to create intelligent assistants",
          icon: <Sparkles className="h-5 w-5 text-cyberpunk-purple" />,
        },
        {
          title: "Analytics",
          href: "/analytics",
          description: "Gain insights into agent performance and usage patterns",
          icon: <BarChart3 className="h-5 w-5 text-holographic-teal" />,
        },
      ],
    },
    {
      title: "Case Studies",
      href: "/case-studies",
    },
    {
      title: "Technology",
      href: "/technology",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Company",
      href: "/about",
      children: [
        {
          title: "About Us",
          href: "/about",
          description: "Our mission, vision, and the team behind Raiden Agents",
          icon: <Users className="h-5 w-5 text-electric-blue" />,
        },
        {
          title: "Meet the Team",
          href: "/team",
          description: "The talented individuals building the future of AI agents",
          icon: <Users className="h-5 w-5 text-cyberpunk-purple" />,
        },
        {
          title: "Contact Us",
          href: "/contact",
          description: "Get in touch with our team for questions or support",
          icon: <Users className="h-5 w-5 text-holographic-teal" />,
        },
      ],
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-black/80 backdrop-blur-md py-3 border-b border-gray-800'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <Logo />
            <span className="ml-3 text-xl font-bold text-white">Raiden</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex mx-6">
              <NavigationMenuList>
                {navItems.map((item) => 
                  item.children ? (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger className="bg-transparent text-white hover:bg-gray-800/50 hover:text-white focus:bg-gray-800/50">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.href}
                                  className="block select-none space-y-1 rounded-md p-3 hover:bg-gray-800/50 hover:text-white"
                                >
                                  <div className="flex items-center">
                                    {child.icon}
                                    <div className="text-sm font-medium leading-none ml-2">{child.title}</div>
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                                    {child.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.title}>
                      <Link to={item.href}>
                        <NavigationMenuLink 
                          className={cn(
                            navigationMenuTriggerStyle(), 
                            "bg-transparent text-white hover:bg-gray-800/50 hover:text-white focus:bg-gray-800/50",
                            location.pathname === item.href && "bg-gray-800/50 text-white"
                          )}
                        >
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* CTA Buttons (Auth/Dashboard) */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="default" className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="hidden md:block">
                  <Button variant="ghost" className="text-white hover:bg-gray-800/50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?signup=true">
                  <Button variant="default" className="bg-electric-blue hover:bg-electric-blue/90 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white ml-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <div key={item.title}>
                  {item.children ? (
                    <div className="py-2">
                      <div className="flex items-center justify-between px-4 py-2 rounded-md bg-gray-800/50">
                        <span className="font-medium text-white">{item.title}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="mt-2 pl-4 space-y-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            to={child.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white rounded-md hover:bg-gray-800/50"
                          >
                            {child.icon}
                            <span className="ml-2">{child.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`px-4 py-2 flex items-center text-gray-300 hover:text-white rounded-md ${
                        location.pathname === item.href ? 'bg-gray-800/50 text-white' : 'hover:bg-gray-800/50'
                      }`}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
              {!user && (
                <Link
                  to="/auth"
                  className="px-4 py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800/50"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
