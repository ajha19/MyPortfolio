import { Github, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import project1 from '../assets/images/Project-1.png';
import Login_Page_unstop from '../assets/images/Login_Page_unstop.png';
import Sahil_Furniture from '../assets/images/Sahil_Furniture.png';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "TheCollarCraft Ecommerce Application",
      description: "Full-stack MERN application with payment integration, user authentication, and admin dashboard for men's fashion accessories.",
      image: project1,
      tech: ["React", "Node.js", "Supabase", "Razorpay", "Admin Dashboard"],
      liveUrl: "https://thecollarcraft.netlify.app/",
      githubUrl: "https://github.com/ajha19/collarcraft-men-shop.git",
      featured: true
    },
    {
      id: 2,
      title: "Unstop Interview Task",
      description: "Login page implementation for Unstop's initial interview round, faithfully recreating the provided Figma design including all UI components, icons, and logos.",
      image: Login_Page_unstop,
      tech: ["React", "CSS", "Figma", "UI Components"],
      liveUrl: "https://unstop-frontend-task-topaz.vercel.app?_vercel_share=HyM1eW1Rth0W90UvDlhMR27vVV6A5EFr",
      githubUrl: "https://github.com/ajha19/unstop-frontend-task.git",
      featured: true
    },
    {
      id: 3,
      title: "Sahil Furnitures",
      description: "Handcrafted Elegance for Your Home Discover exquisite wooden furniture that combines traditional craftsmanship with modern design. Every piece is carefully selected to bring warmth and beauty to your living spaces.",
      image: Sahil_Furniture,
      tech: ["Next", "Typescript", "Geolocation API", "Framer Motion"],
      liveUrl: "https://sahil-furniture-bhilwara.netlify.app/",
      githubUrl: "https://github.com/ajha19/v0-sahil-furniture-website.git",
      featured: false
    },
    {
      id: 4,
      title: "Social Media Analytics",
      description: "Analytics dashboard for social media metrics with real-time data processing and insights.",
      image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["React", "D3.js", "Node.js", "MongoDB"],
      liveUrl: "#",
      githubUrl: "https://github.com/ajha19",
      featured: false
    },
    {
      id: 5,
      title: "Learning Management System",
      description: "Educational platform with course management, progress tracking, and interactive learning modules.",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800",
      tech: ["React", "Node.js", "MySQL", "JWT"],
      liveUrl: "#",
      githubUrl: "https://github.com/ajha19",
      featured: false
    }
  ];

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  const handleProjectClick = (url: string) => {
    if (url !== "#") {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Featured Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A showcase of my recent work and technical expertise
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {featuredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={item}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              onClick={() => handleProjectClick(project.liveUrl)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="text-center text-white"
                  >
                    <Eye className="mx-auto mb-2" size={32} />
                    <p className="text-lg font-semibold">View Project</p>
                    <p className="text-sm opacity-90">Click to open</p>
                  </motion.div>
                </div>
                
                {/* GitHub link - separate from main click */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 block bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
                  >
                    <Github size={18} />
                  </a>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Other Projects Grid */}
        <motion.div
           variants={container}
           initial="hidden"
           whileInView="show"
           viewport={{ once: true }}
        >
          <motion.h3 
            variants={item}
            className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8"
          >
            Client Projects
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={item}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer"
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                onClick={() => handleProjectClick(project.liveUrl)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="mx-auto mb-1 animate-pulse" size={24} />
                      <p className="text-sm font-semibold">View Project</p>
                    </div>
                  </div>
                  
                  {/* GitHub link */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 block bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <Github size={14} />
                    </a>
                  </div>
                </div>
                
                <div className="p-5">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-2xl mx-auto hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <h3 className="text-2xl font-bold mb-4">Interested in My Work?</h3>
            <p className="text-lg opacity-90 mb-6">
              Let's discuss how I can help bring your next project to life with clean, scalable code and modern design.
            </p>
            <motion.a
              href="mailto:jhaaman810@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:bg-gray-50"
            >
              Start a Conversation
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;