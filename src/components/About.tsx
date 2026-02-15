
import { Code, Database, Globe, Zap, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const highlights = [
    {
      icon: <Code className="text-blue-600 dark:text-blue-400" size={24} />,
      title: "Frontend Expertise",
      description: "Specializing in creating responsive, high-performance UIs using React.js with modern best practices"
    },
    {
      icon: <Database className="text-green-600 dark:text-green-400" size={24} />,
      title: "Backend Development",
      description: "Proficient in backend development with Node.js, Express.js, and MongoDB for scalable solutions"
    },
    {
      icon: <Globe className="text-purple-600 dark:text-purple-400" size={24} />,
      title: "Full-Stack Solutions",
      description: "Experienced in delivering production-ready features and end-to-end web applications"
    },
    {
      icon: <Zap className="text-orange-600 dark:text-orange-400" size={24} />,
      title: "API Design",
      description: "Skilled in designing RESTful APIs and deploying cloud-native applications"
    },
    {
      icon: <Users className="text-pink-600 dark:text-pink-400" size={24} />,
      title: "Clean Code Advocate",
      description: "Passionate about clean code, modular architecture, and seamless user experience"
    },
    {
      icon: <Target className="text-red-600 dark:text-red-400" size={24} />,
      title: "Production Ready",
      description: "3 years of experience building scalable, full-stack web applications for production"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="about" className="section-padding bg-white dark:bg-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase text-sm">Who I Am</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 tracking-tight">
            About <span className="text-gradient animate-title">Me</span>
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Narrative */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="glass-card p-8 hover:border-blue-500/30 transition-colors group">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                💻 My Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                I'm a MERN Stack Developer with 3 years of experience in building scalable, 
                full-stack web applications. My journey in software development has been driven 
                by a passion for creating solutions that make a real difference.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I believe in writing code that is not just functional, but also maintainable, 
                scalable, and elegant. Every project is an opportunity to learn something new 
                and push the boundaries of what's possible.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-purple-500/30 transition-colors group">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                🎯 My Approach
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I focus on understanding the problem deeply before writing any code. 
                This helps me create solutions that are not just technically sound, 
                but also user-centric and business-focused.
              </p>
            </div>
            
            {/* CTA */}
            <div className="pt-4">
              <a href="#contact" className="btn-primary inline-flex items-center gap-2">
                Let's Talk
                <Users className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Highlights Grid */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                variants={item}
                className="glass-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                  {highlight.icon}
                </div>
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {highlight.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;