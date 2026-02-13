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
import { ThemeProvider } from './contexts/ThemeContext';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Track page visit
  useAnalytics();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main>
          <Hero />
          <About />
          <TechStack />
          <Projects />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
        <AnalyticsButton onClick={() => setShowAnalytics(true)} />
        {showAnalytics && (
          <AnalyticsDashboard 
            isOpen={showAnalytics}
            onClose={() => setShowAnalytics(false)} 
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;