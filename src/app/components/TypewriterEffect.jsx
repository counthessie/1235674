// src/app/components/Typewriter.jsx
'use client';
import { useState, useEffect } from 'react';

export default function Typewriter() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const textArray = ['Mert', 'Web Developer'];
  const period = 1000 // Yazı tamamlandıktan sonra bekleme süresi
  
  useEffect(() => {
    const ticker = setTimeout(() => {
      tick();
    }, typingSpeed);
    
    return () => clearTimeout(ticker);
  }, [text, isDeleting, loopNum, typingSpeed]);
  
  const tick = () => {
    const i = loopNum % textArray.length;
    const fullText = textArray[i];
    
    // Silme veya yazma durumuna göre yeni metni belirle
    const newText = isDeleting 
      ? fullText.substring(0, text.length - 1) 
      : fullText.substring(0, text.length + 1);
    
    setText(newText);
    
    // Silme durumunda daha hızlı yaz
    if (isDeleting) {
      setTypingSpeed(prevSpeed => prevSpeed / 1.5);
    }
    
    // Yazma tamamlandığında
    if (!isDeleting && newText === fullText) {
      setIsDeleting(true);
      setTypingSpeed(period); // Silmeye başlamadan önce bekle
    } 
    // Silme tamamlandığında
    else if (isDeleting && newText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setTypingSpeed(150); // Normal yazma hızına dön
    }
    // Normal yazma durumunda
    else if (!isDeleting) {
      setTypingSpeed(150);
    }
  };
  
  return (
    <h1 className="text-4xl font-bold text-white">
      {text}
      <span className="text-green-400 animate-pulse">|</span>
    </h1>
  );
}