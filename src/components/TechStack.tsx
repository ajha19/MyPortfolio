import { motion } from 'framer-motion';

const TechStack = () => {
  const categories = [
    { 
      name: 'Frontend', 
      icon: '🎨', 
      skills: ['React', 'HTML5', 'CSS3', 'Tailwind', 'Framer Motion', 'Bootstrap', 'React Router'] 
    },
    { 
      name: 'Backend', 
      icon: '⚙️', 
      skills: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'Socket.io', 'Microservices'] 
    },
    { 
      name: 'Databases', 
      icon: '🗄️', 
      skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Supabase', 'Firebase', 'Redis'] 
    },
    { 
      name: 'Languages', 
      icon: '💻', 
      skills: ['JavaScript (ES6+)', 'TypeScript', 'Java', 'Python', 'Go', 'SQL'] 
    },
    { 
      name: 'Tools & DevOps', 
      icon: '🛠️', 
      skills: ['Git', 'GitHub', 'Docker', 'AWS', 'Vercel', 'Postman', 'Vite', 'Webpack'] 
    },
    { 
      name: 'AI & Design', 
      icon: '🤖', 
      skills: ['OpenAI API', 'TensorFlow', 'Figma', 'Adobe XD', 'Canva', 'Midjourney'] 
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
    <section id="skills" className="section-padding bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
       {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase text-sm">Skills & Tools</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 tracking-tight">
            My <span className="text-gradient animate-title">Tech Stack</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable web applications
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className="glass-card p-8 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 border border-gray-100/50 dark:border-gray-600/50 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Overview Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-4 text-center"
        >
             <div className="px-6 py-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium">
               🚀 Full-Stack Development
             </div>
             <div className="px-6 py-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 font-medium">
               🎨 UI/UX Design
             </div>
             <div className="px-6 py-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-medium">
               🔒 Security Best Practices
             </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;