import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NavBar = () => {

  return (
    <nav
     
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="backdrop-blur-lg bg-gray-900/50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-white" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                      <path d="M17 22h-2" />
                      <path d="M9 22H7" />
                      <path d="M15 6h2" />
                      <path d="M15 10h2" />
                      <path d="M7 6h2" />
                      <path d="M7 10h2" />
                    </svg>
                  </div>
                </motion.div>
                <span className="text-xl font-bold text-blue-100">AudioAI</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/"
                className="text-blue-100/80 hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-500/30"
              >
                Get Started
              </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
