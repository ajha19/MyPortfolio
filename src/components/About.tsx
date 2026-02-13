
import { Code, Database, Globe, Zap, Users, Target } from 'lucide-react';

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

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
            About Me
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Passionate about crafting exceptional digital experiences through code
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 animate-fade-in-left">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">💻 My Journey</h3>
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

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 My Approach</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I focus on understanding the problem deeply before writing any code. 
                This helps me create solutions that are not just technically sound, 
                but also user-centric and business-focused.
              </p>
            </div>
          </div>

          <div className="grid gap-6 animate-fade-in-right">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    {highlight.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{highlight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{highlight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center animate-fade-in-up delay-600">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-2xl mx-auto hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <h3 className="text-2xl font-bold mb-4">Let's Work Together! 😊</h3>
            <p className="mb-6">
              Email me for collaboration, projects, or anything else. I'm always excited to discuss new opportunities!
            </p>
            <a
              href="mailto:jhaaman810@gmail.com"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-gray-50"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;