import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Github, Linkedin, Phone } from 'lucide-react';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailClick = () => {
    window.location.href = 'mailto:jhaaman810@gmail.com?subject=Collaboration Opportunity&body=Hi Aman,%0D%0A%0D%0AI would like to discuss a potential collaboration opportunity.%0D%0A%0D%0ABest regards,';
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
            Let's Connect! 🚀
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Ready to bring your ideas to life? Let's discuss your next project and create something amazing together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8 animate-fade-in-left">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Get In Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">Email</p>
                      <a
                        href="mailto:jhaaman810@gmail.com"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        jhaaman810@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Github className="text-gray-600 dark:text-gray-300" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">GitHub</p>
                      <a
                        href="https://github.com/ajha19"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        View My Projects
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Linkedin className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">LinkedIn</p>
                      <a
                        href="https://www.linkedin.com/in/aman-jha-3103a9185/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        Professional Network
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Available For</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center group">
                    <CheckCircle className="text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" size={16} />
                    Full-stack web development projects
                  </li>
                  <li className="flex items-center group">
                    <CheckCircle className="text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" size={16} />
                    MERN stack applications
                  </li>
                  <li className="flex items-center group">
                    <CheckCircle className="text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" size={16} />
                    API development and integration
                  </li>
                  <li className="flex items-center group">
                    <CheckCircle className="text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" size={16} />
                    Technical consulting
                  </li>
                  <li className="flex items-center group">
                    <CheckCircle className="text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" size={16} />
                    Code reviews and optimization
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-right">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Start a Conversation</h3>
              
              {!isSubmitted ? (
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Click the button below to send me an email with a pre-filled template, 
                    or feel free to reach out directly at{' '}
                    <a
                      href="mailto:jhaaman810@gmail.com"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      jhaaman810@gmail.com
                    </a>
                  </p>

                  <button
                    onClick={handleEmailClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <Mail size={20} className="group-hover:animate-bounce" />
                    <span>Send Email for Collaboration</span>
                    <Send size={20} className="group-hover:animate-bounce" />
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Response time: Usually within 24 hours 😊
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="text-green-500 mx-auto mb-4 animate-bounce" size={48} />
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Thank You!</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your message has been sent. I'll get back to you soon!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-16 text-center animate-fade-in-up delay-600">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-2xl mx-auto hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <h3 className="text-2xl font-bold mb-4">😊 Let's Build Something Amazing!</h3>
              <p className="text-lg opacity-90">
                Whether you have a project in mind, need technical guidance, or just want to chat about technology, 
                I'm always excited to connect with fellow developers and innovators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;