// app/components/Header.jsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-dark/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <a href="#" className="text-2xl font-bold text-white">Mert<span className="text-code-green">.</span></a>
        </motion.div>
        
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex space-x-8">
            <li><a href="#" className="text-white hover:text-code-green transition-colors">Ana Sayfa</a></li>
            <li><a href="#projects" className="text-white hover:text-code-green transition-colors">Projeler</a></li>
            <li><a href="#contact" className="text-white hover:text-code-green transition-colors">İletişim</a></li>
          </ul>
        </motion.nav>
      </div>
    </header>
  );
}