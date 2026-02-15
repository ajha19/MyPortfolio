import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsButton from './components/Analytics/AnalyticsButton';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import ResumeModal from './components/ResumeModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showResume, setShowResume] = useState(false);
  
  // Track page visit
  useAnalytics();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header onOpenResume={() => setShowResume(true)} />
        <main>
          <Hero onOpenResume={() => setShowResume(true)} />
          <About />
          <TechStack />
          <Projects />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
        <AnalyticsButton onClick={() => setShowAnalytics(true)} />
        
        {/* Analytics Modal */}
        {showAnalytics && (
          <AnalyticsDashboard 
            isOpen={showAnalytics}
            onClose={() => setShowAnalytics(false)} 
          />
        )}

        {/* Resume Modal */}
        <ResumeModal 
          isOpen={showResume} 
          onClose={() => setShowResume(false)} 
        />
      </div>
    </ThemeProvider>
  );
}

export default App;