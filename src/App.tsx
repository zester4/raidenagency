
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/dashboard/Dashboard';
import AgentBuilder from './pages/dashboard/AgentBuilder';
import AgentPlayground from './pages/dashboard/AgentPlayground';
import Settings from './pages/dashboard/Settings';
import Tools from './pages/dashboard/Tools';
import DashboardPricing from './pages/dashboard/Pricing';
import TeamManagement from './pages/dashboard/TeamManagement';
import Analytics from './pages/dashboard/Analytics';
import Services from './pages/Services';
import CaseStudies from './pages/CaseStudies';
import Technology from './pages/Technology';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Pricing from './pages/Pricing';
import Team from './pages/Team';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/services" element={<Services />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/team" element={<Team />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/agents" element={<ProtectedRoute><AgentBuilder /></ProtectedRoute>} />
          <Route path="/dashboard/playground" element={<ProtectedRoute><AgentPlayground /></ProtectedRoute>} />
          <Route path="/dashboard/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/pricing" element={<ProtectedRoute><DashboardPricing /></ProtectedRoute>} />
          <Route path="/dashboard/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
