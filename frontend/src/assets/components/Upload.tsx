import Button from '@mui/material/Button';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBar } from './NavBar';

const FloatingBulb = ({ index }: { index: number }) => {
  const randomDelay = Math.random() * 2;
  const randomDuration = 3 + Math.random() * 2;
  
  return (
    <motion.div
      className="absolute w-2 h-2 bg-blue-400 rounded-full"
      style={{
        left: `${(index % 5) * 25}%`,
        top: `${Math.floor(index / 5) * 25}%`,
        filter: 'blur(4px)',
      }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.2, 1],
        y: [0, -20, 0],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export const Upload = () => {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bulbs] = useState(() => Array.from({ length: 15 }, (_, i) => i));

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    
    const file = e.target[0].files[0]
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post("http://localhost:3000/api/upload-file", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Response:', response.data);
      const cleanedResponse = response.data.response.replace(/\*/g, '').trim();
      setAiResponse(cleanedResponse);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const LoadingSpinner = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-8 text-center"
    >
      <div className="relative w-24 h-24 mx-auto mb-4">
        <motion.span
          className="block w-24 h-24 border-4 border-blue-300/30 rounded-full"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Infinity
          }}
        />
        <motion.span
          className="absolute top-0 left-0 block w-24 h-24 border-4 border-blue-400 rounded-full border-t-transparent"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity
          }}
        />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl text-blue-100 font-medium"
      >
        Analyzing your audio...
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-blue-200/70 mt-2"
      >
        This may take a few moments
      </motion.p>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const renderResponse = (response: string) => {
    const points = response
      .split('\n')
      .map(point => point.trim())
      .filter(point => point !== '');

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mt-8 bg-gray-900/50 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 p-8 max-w-3xl mx-auto"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-2xl font-bold mb-6 text-blue-100 border-b border-gray-700/50 pb-4"
        >
          Summary Points
        </motion.h2>
        <motion.ul className="space-y-4">
          {points.map((point, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              className="flex items-start space-x-4 text-lg"
            >
              <span className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-blue-400"/>
              <span className="text-blue-100/90 leading-relaxed">{point}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    );
  };

  return (
    <div>
      <NavBar />
      <div className="relative min-h-screen w-full bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {bulbs.map((index) => (
            <FloatingBulb key={index} index={index} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-blue-900/20" />
        </div>
        
        <div className='relative w-full max-w-4xl mx-auto min-h-screen py-12 px-4 flex flex-col items-center justify-center pt-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form className='text-center bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 shadow-xl rounded-xl p-8 mb-8' onSubmit={handleSubmit}>
              <h1 className="text-3xl font-bold text-blue-100 mb-6">Audio Summary</h1>
              <div className="grid w-full max-w-md mx-auto items-center gap-1.5 py-2">
                <input
                  id="picture"
                  type="file"
                  className="flex h-10 w-full rounded-lg border-2 border-gray-700/50 bg-gray-800/50 px-3 py-2 text-sm text-blue-100 file:border-0 file:bg-transparent file:text-blue-400 file:text-sm file:font-medium hover:border-blue-500/50 focus:border-blue-500/50 focus:outline-none"
                />
              </div>
              <Button 
                variant="contained" 
                type='submit'
                disabled={isLoading}
                style={{
                  marginTop: '1rem',
                  backgroundColor: isLoading ? '#1e293b' : '#3b82f6',
                  textTransform: 'none',
                  fontSize: '1rem',
                  padding: '0.5rem 2rem'
                }}
              >
                {isLoading ? 'Processing...' : 'Generate Summary'}
              </Button>
            </form>
          </motion.div>
          <AnimatePresence>
            {isLoading && <LoadingSpinner />}
            {!isLoading && aiResponse && renderResponse(aiResponse)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
