import { useState, useEffect } from 'react';
import { ArrowDown, FileText, Sparkles, Github, Linkedin, Twitter } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  onOpenResume: () => void;
}

const Hero = ({ onOpenResume }: HeroProps) => {
  const [textIndex, setTextIndex] = useState(0);
  const roles = ["Full Stack Developer", "Software Engineer", "UI/UX Enthusiast", "Problem Solver"];
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden section-padding bg-gray-50 dark:bg-gray-900">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6"
          >
            <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Open to Work</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Hi, I'm <br />
            <span className="text-gradient animate-title">Aman Jha</span>
          </h1>

          <div className="h-10 mb-8 overflow-hidden">
             <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium"
            >
              {roles[textIndex]}
            </motion.p>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed mx-auto md:mx-0">
            Crafting exceptional digital experiences with modern technologies. 
            Focused on building scalable, performant, and accessible web applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
             <a href="#projects" className="btn-primary flex items-center justify-center gap-2 group">
              View Work
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
            <button 
              onClick={onOpenResume}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Resume
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center md:justify-start gap-6 text-gray-600 dark:text-gray-400">
             <a href="https://github.com/ajha19" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/in/aman-jha-3103a9185" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </motion.div>

        {/* Visual Content (3D Tilt / Image) */}
        <motion.div 
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative hidden md:block perspective-1000"
        >
          <div className="relative w-full max-w-[500px] h-[500px] mx-auto flex items-center justify-center">
            {/* Background Blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-[100px] opacity-20 animate-pulse-glow"></div>

            {/* Personal Project Picture Placeholder */}
            <motion.div 
              className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl z-10 border border-white/20 glass-card group cursor-pointer"
              initial={{ rotateY: -5, rotateX: 5 }}
              whileHover={{ scale: 1.02, rotateY: 0, rotateX: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                const element = document.getElementById('projects');
                if (element) {
                  const headerOffset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                  });
                }
              }}
            >
              {/* REPLACE THIS IMAGE URL WITH YOUR PERSONAL PROJECT PICTURE */}
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072" 
                alt="Personal Project" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-100 text-xs font-semibold mb-3">
                  Featured Project
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Project Name</h3>
                <p className="text-gray-200 text-sm line-clamp-2">
                  A brief description of your amazing personal project goes here.
                </p>
              </div>
            </motion.div>

            {/* Experience Floating Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 top-20 glass-card p-4 flex items-center gap-3 z-20 shadow-xl border border-white/30 backdrop-blur-xl"
            >
              <div className="p-2.5 bg-blue-100 dark:bg-blue-600/20 rounded-xl text-blue-600 dark:text-blue-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Experience</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">3+ Years</p>
              </div>
            </motion.div>

            {/* Projects Floating Card */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -left-6 bottom-24 glass-card p-4 flex items-center gap-3 z-20 shadow-xl border border-white/30 backdrop-blur-xl"
            >
              <div className="p-2.5 bg-green-100 dark:bg-green-600/20 rounded-xl text-green-600 dark:text-green-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Projects</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">15+ Projects</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={scrollToAbout}
      >
        <ArrowDown className="w-6 h-6 text-gray-400" />
      </motion.div>
    </section>
  );
};

export default Hero;