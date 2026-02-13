
import { Heart, Code, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Aman Jha
            </h3>
            <p className="text-gray-400 dark:text-gray-500">
              Full Stack Developer passionate about creating exceptional digital experiences 
              through clean, efficient, and scalable code.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in-up delay-200">
            <h4 className="text-lg font-semibold text-gray-300">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-left hover:translate-x-1 transform transition-transform"
              >
                Home
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-left hover:translate-x-1 transform transition-transform"
              >
                About
              </button>
              <button
                onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-left hover:translate-x-1 transform transition-transform"
              >
                Skills
              </button>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-left hover:translate-x-1 transform transition-transform"
              >
                Projects
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-left hover:translate-x-1 transform transition-transform"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 animate-fade-in-up delay-400">
            <h4 className="text-lg font-semibold text-gray-300">Connect With Me</h4>
            <div className="flex space-x-4">
              <a
                href="mailto:jhaaman810@gmail.com"
                className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://github.com/ajha19"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-all duration-300 hover:scale-110"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/aman-jha-3103a9185/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Always open to interesting conversations and collaboration opportunities!
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 animate-fade-in-up delay-600">
              <span>Made with</span>
              <Heart className="text-red-500 animate-pulse" size={16} />
              <span>and</span>
              <Code className="text-blue-400 animate-pulse" size={16} />
              <span>by Aman Jha</span>
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm animate-fade-in-up delay-700">
              © {currentYear} Aman Jha. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;