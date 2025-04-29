// src/app/components/Hero.jsx
'use client';
import { motion } from 'framer-motion';
import TypewriterEffect from './TypewriterEffect';
import { useState, useEffect } from 'react';

// Teknoloji yazıları için silinip yazılma efekti
function TechTypewriter({ technologies }) {
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  
  useEffect(() => {
    const currentTech = technologies[currentTechIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Yazma modu
        setDisplayText(currentTech.substring(0, displayText.length + 1));
        setTypingSpeed(100); // Yazma hızı sabit
        
        if (displayText === currentTech) {
          // Yazma tamamlandı, silme moduna geçmeden önce bekle
          setIsDeleting(true);
          setTypingSpeed(1000); // 2 saniye bekle
          return; // Hemen çık, bekle
        }
      } else {
        // İlk silme çağrısında, bekleme süresini azalt
        if (displayText === currentTech) {
          setTypingSpeed(100); // Normal silme hızına dön
        }
        
        // Silme modu
        setDisplayText(currentTech.substring(0, displayText.length - 1));
        setTypingSpeed(150); // Silme hızını artır (daha yavaş sil)
        
        if (displayText === '') {
          // Silme tamamlandı, sonraki teknolojiye geç
          setIsDeleting(false);
          setCurrentTechIndex((currentTechIndex + 1) % technologies.length);
          setTypingSpeed(500); // Yeni teknolojiye geçmeden önce biraz bekle
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [displayText, currentTechIndex, isDeleting, technologies, typingSpeed]);
  
  return (
    <span className="inline-block min-w-[120px] text-code-green">
      {displayText}
      <span className="inline-block w-1 h-6 ml-1 bg-code-green animate-pulse"></span>
    </span>
  );
}

export default function Hero() {
  const technologies = ['Next.js', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Express.js', 'GraphQL'];
  
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <TypewriterEffect />
      
      <motion.div
        className="flex flex-col items-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-xl md:text-2xl text-gray-300 mb-6 font-mono">
          <span className="text-white">{'{'}</span> 
          <span className="text-gray-400">tech:</span> <TechTypewriter technologies={technologies} /> 
          <span className="text-white">{'}'}</span>
        </div>
        
        <div className="text-white-400 max-w-lg">
          Modern web uygulamaları geliştiren tutkulu bir yazılım geliştiricisi. 
          Kullanıcı deneyimini ön planda tutan, performans odaklı çözümler üretiyorum.
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <a 
          href="#projects" 
          className="bg-code-green text-bg-dark px-8 py-4 rounded-full font-medium hover:bg-code-green/90 transition-colors"
        >
          Projelerime Göz At
        </a>
      </motion.div>
    </section>
  );
}