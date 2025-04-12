
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Check, AlertCircle, Loader, Building, Users, BriefcaseBusiness, Globe
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const industryOptions = [
  { value: 'finance', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare & Life Sciences' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'technology', label: 'Technology & SaaS' },
  { value: 'telecom', label: 'Telecommunications' },
  { value: 'government', label: 'Government & Public Sector' },
  { value: 'education', label: 'Education' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'other', label: 'Other' }
];

const companySize = [
  { value: '1-50', label: '1-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1001-5000', label: '1001-5000 employees' },
  { value: '5001+', label: '5000+ employees' }
];

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'demo', label: 'Request a Demo' },
  { value: 'pricing', label: 'Pricing Information' },
  { value: 'support', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'career', label: 'Career Information' }
];

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    companySize: '',
    inquiryType: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formCompletion, setFormCompletion] = useState(0);
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'company', 'message'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const updateCompletionPercentage = () => {
    const totalFields = 9; // Total number of form fields
    const filledFields = Object.values(formData).filter(value => value).length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    setFormCompletion(percentage);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    updateCompletionPercentage();
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    updateCompletionPercentage();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Form validation failed",
        description: "Please check the form for errors and try again.",
      });
      return;
    }
    
    setFormStatus('submitting');
    
    // Simulate API call
    try {
      // In a real app, this would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormStatus('success');
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you within 24-48 hours.",
      });
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          industry: '',
          companySize: '',
          inquiryType: '',
          message: ''
        });
        setFormCompletion(0);
        setFormStatus('idle');
      }, 3000);
      
    } catch (error) {
      setFormStatus('error');
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "There was an error submitting your form. Please try again.",
      });
    }
  };
  
  const FormField = ({ 
    label, name, type = 'text', placeholder, value, error,
    required = false, className = '', icon: Icon 
  }: { 
    label: string; 
    name: string; 
    type?: string; 
    placeholder?: string;
    value: string;
    error?: string;
    required?: boolean;
    className?: string;
    icon?: React.ElementType;
  }) => (
    <div className={`mb-6 ${className}`}>
      <label htmlFor={name} className="block text-sm text-white/70 mb-2">
        {label} {required && <span className="text-electric-blue">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
            <Icon size={16} />
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            rows={5}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${Icon ? 'pl-10' : 'pl-4'} w-full bg-white/5 border ${error ? 'border-destructive' : 'border-white/10'} rounded-md py-3 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-electric-blue transition-colors duration-200`}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${Icon ? 'pl-10' : 'pl-4'} w-full bg-white/5 border ${error ? 'border-destructive' : 'border-white/10'} rounded-md py-3 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-electric-blue transition-colors duration-200`}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
  
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
          <h2 className="text-3xl md:text-4xl font-heading mb-6">Get in Touch</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Fill out the form below and our team will get back to you within 24-48 hours
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-10">
          {/* Form completion indicator */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-white/50 mb-2">
              <span>Form completion</span>
              <span>{formCompletion}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-electric-blue"
                initial={{ width: '0%' }}
                animate={{ width: `${formCompletion}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <FormField
                label="First Name"
                name="firstName"
                placeholder="Your first name"
                value={formData.firstName}
                error={formErrors.firstName}
                required
              />
              
              <FormField
                label="Last Name"
                name="lastName"
                placeholder="Your last name"
                value={formData.lastName}
                error={formErrors.lastName}
                required
              />
              
              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="your.email@company.com"
                value={formData.email}
                error={formErrors.email}
                required
              />
              
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                error={formErrors.phone}
              />
              
              <FormField
                label="Company Name"
                name="company"
                placeholder="Your company name"
                value={formData.company}
                error={formErrors.company}
                required
                icon={Building}
              />
              
              <div className="mb-6">
                <label htmlFor="industry" className="block text-sm text-white/70 mb-2">
                  Industry
                </label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => handleSelectChange('industry', value)}
                >
                  <SelectTrigger className="w-full bg-white/5 border border-white/10 rounded-md py-6 text-white focus:outline-none focus:border-electric-blue">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="companySize" className="block text-sm text-white/70 mb-2">
                  Company Size
                </label>
                <Select 
                  value={formData.companySize} 
                  onValueChange={(value) => handleSelectChange('companySize', value)}
                >
                  <SelectTrigger className="w-full bg-white/5 border border-white/10 rounded-md py-6 text-white focus:outline-none focus:border-electric-blue">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySize.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="inquiryType" className="block text-sm text-white/70 mb-2">
                  Inquiry Type
                </label>
                <Select 
                  value={formData.inquiryType} 
                  onValueChange={(value) => handleSelectChange('inquiryType', value)}
                >
                  <SelectTrigger className="w-full bg-white/5 border border-white/10 rounded-md py-6 text-white focus:outline-none focus:border-electric-blue">
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <FormField
              label="Message"
              name="message"
              type="textarea"
              placeholder="Tell us about your project or inquiry..."
              value={formData.message}
              error={formErrors.message}
              required
            />
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={formStatus === 'submitting' || formStatus === 'success'}
                className={`w-full py-4 rounded-md font-heading flex items-center justify-center transition-all duration-300 ${
                  formStatus === 'submitting' 
                    ? 'bg-cyber-purple/50 cursor-wait' 
                    : formStatus === 'success'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-cyber-purple hover:bg-cyber-purple/80'
                }`}
              >
                {formStatus === 'idle' && (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
                {formStatus === 'submitting' && (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                )}
                {formStatus === 'success' && (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Message Sent
                  </>
                )}
                {formStatus === 'error' && (
                  <>
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Try Again
                  </>
                )}
              </button>
            </div>
            
            <p className="text-center text-white/40 text-sm mt-4">
              By submitting this form, you agree to our <a href="#" className="text-electric-blue hover:underline">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
