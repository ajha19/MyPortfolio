import { useState, useEffect } from 'react';
import { ArrowDown, Mail, Sparkles, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const fullName = 'Aman Jha';

  useEffect(() => {
    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;

    const startTyping = () => {
      setIsTyping(true);
      setDisplayedText('');
      currentIndex = 0;

      typingInterval = setInterval(() => {
        if (currentIndex < fullName.length) {
          setDisplayedText(fullName.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          // Wait 3 seconds then restart
          setTimeout(() => {
            startTyping();
          }, 3000);
        }
      }, 150);
    };

    // Start the typing animation
    startTyping();

    return () => {
      if (typingInterval) {
        clearInterval(typingInterval);
      }
    };
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Greeting with Icon */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-blue-600 dark:text-blue-400 mr-2" size={24} />
            </motion.div>
            <span className="text-lg text-gray-600 dark:text-gray-300 font-medium">Hi 👋, I'm</span>
          </motion.div>

          {/* Name with Auto-Typing Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent min-h-[1.2em] flex items-center justify-center">
              <span className="inline-flex items-center">
                <span className="mr-1">{displayedText || 'Aman Jha'}</span>
                <span 
                  className={`inline-block w-1 h-12 md:h-16 bg-gradient-to-b from-blue-600 to-purple-600 transition-opacity duration-100 ${
                    showCursor ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ marginLeft: '2px' }}
                />
              </span>
            </h1>
          </motion.div>

          {/* Title */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8"
          >
            A passionate <span className="font-semibold text-blue-600 dark:text-blue-400">Full Stack Developer</span> || <span className="font-semibold text-purple-600 dark:text-purple-400">Software Engineer</span>
          </motion.p>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            MERN Stack Developer with 3 years of experience in building scalable, full-stack web applications. 
            Specializing in creating responsive, high-performance UIs and robust backend solutions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.a
              href="mailto:jhaaman810@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl transition-all duration-300"
            >
              <Mail className="mr-2 group-hover:animate-bounce" size={20} />
              Email Me
            </motion.a>
            <motion.button
              onClick={scrollToAbout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center px-8 py-4 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold rounded-full hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
            >
              <Download className="mr-2 group-hover:animate-bounce" size={20} />
              My Work
            </motion.button>
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FileText className="mr-2 text-blue-600" size={20} />
              Resume
            </motion.a>
          </motion.div>

          {/* Fun Fact */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-all duration-500"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              ⚡ Fun fact: "Programs must be written for people to read, and only incidentally for machines to execute" 
              <span className="font-medium">— Harold Abelson (MIT)</span>
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDown className="text-gray-400 dark:text-gray-500" size={24} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;