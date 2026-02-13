import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TechStack = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Frontend');

  const technologies = [
    { name: 'React', category: 'Frontend', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { name: 'JavaScript', category: 'Languages', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { name: 'Java', category: 'Languages', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { name: 'HTML5', category: 'Frontend', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
    { name: 'CSS3', category: 'Frontend', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { name: 'TypeScript', category: 'Languages', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { name: 'Node.js', category: 'Backend', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    { name: 'Express.js', category: 'Backend', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300' },
    { name: 'MongoDB', category: 'Databases', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    { name: 'MySQL', category: 'Databases', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { name: 'PostgreSQL', category: 'Databases', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { name: 'Supabase', category: 'Databases', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    { name: 'GraphQL', category: 'Tools', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
    { name: 'Chart.js', category: 'Tools', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
    { name: 'Bootstrap', category: 'Frontend', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { name: 'JWT', category: 'Tools', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
    { name: 'Vite', category: 'Tools', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { name: 'Figma', category: 'Design', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { name: 'Blender', category: 'Design', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
    { name: 'TensorFlow', category: 'AI/ML', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
    { name: 'Git', category: 'Tools', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { name: 'GitHub', category: 'Tools', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300' },
    { name: 'Postman', category: 'Tools', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
    { name: 'NPM', category: 'Tools', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { name: 'React Router', category: 'Frontend', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' }
  ];

  const categories = [
    { name: 'Frontend', icon: '🎨', technologies: technologies.filter(tech => tech.category === 'Frontend') },
    { name: 'Backend', icon: '⚙️', technologies: technologies.filter(tech => tech.category === 'Backend') },
    { name: 'Languages', icon: '💻', technologies: technologies.filter(tech => tech.category === 'Languages') },
    { name: 'Databases', icon: '🗄️', technologies: technologies.filter(tech => tech.category === 'Databases') },
    { name: 'Tools', icon: '🛠️', technologies: technologies.filter(tech => tech.category === 'Tools') },
    { name: 'Design', icon: '🎭', technologies: technologies.filter(tech => tech.category === 'Design') },
    { name: 'AI/ML', icon: '🤖', technologies: technologies.filter(tech => tech.category === 'AI/ML') }
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💻 Tech Stack
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable web applications
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-2xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {category.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {category.technologies.length}
                    </span>
                  </div>
                  <motion.div 
                    animate={{ rotate: expandedCategory === category.name ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedCategory === category.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="flex flex-wrap gap-3">
                          {category.technologies.map((tech, techIndex) => (
                            <motion.span
                              key={techIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer ${tech.color}`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {tech.name}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Quick Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <h3 className="text-2xl font-bold mb-4">🚀 Ready to Build Amazing Things</h3>
              <p className="text-lg opacity-90 mb-4">
                With expertise across the full stack, I can bring your ideas to life from concept to deployment.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">Full-Stack Development</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">API Design</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Database Architecture</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">UI/UX Implementation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;