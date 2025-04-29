// src/app/components/CodeBackground.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function CodeBackground() {
  const matrixCanvasRef = useRef(null);
  const codeSnippetsContainerRef = useRef(null);
  
  // Matrix efekti (sol taraf) - Değiştirilmedi
  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth / 2; // Sol yarı
    canvas.height = window.innerHeight;
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    const drops = Array(columns).fill(1);
    
    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    
    function draw() {
      // Daha az silme efekti için alpha değerini düşürdüm
      ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        
        // Daha parlak yeşil tonları
        const greenIntensity = 180 + Math.floor(Math.random() * 75);
        ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, 0.95)`;
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Daha hızlı düşme efekti
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        
        // Bazı karakterleri daha hızlı düşür
        drops[i] += Math.random() > 0.98 ? 2 : 1;
      }
    }
    
    const interval = setInterval(draw, 35);
    
    const handleResize = () => {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Kod parçaları efekti (sağ taraf) - DOM elementleri kullanarak
  useEffect(() => {
    const container = codeSnippetsContainerRef.current;
    
    // Kod parçaları
    const codeFragments = [
      "import React from 'react';",
      "function App() { return <div />; }",
      "export default App;",
      "useState(null);",
      "useEffect(() => {}, []);",
      "const [data, setData] = useState();",
      "const router = useRouter();",
      "next/image",
      "next/link",
      "getStaticProps()",
      "getServerSideProps()",
      "npm install next react",
      "yarn add react-dom",
      "const PORT = process.env.PORT",
      "app.listen(3000)",
      "console.log('Hello')",
      "map((item) => <div>{item}</div>)",
      "filter(item => item.id === 1)",
      "reduce((acc, val) => acc + val, 0)",
      "className={styles.container}",
      "const styles = { color: 'green' }",
      "tailwind.config.js",
      "next.config.js",
      "package.json",
      "const sum = (a, b) => a + b;",
      "class Component extends React.Component",
      "render() { return <div />; }",
      "async/await",
      "try { ... } catch (error) { }",
      "fetch('/api/data')"
    ];
    
    // Daha kısa kod parçaları da ekleyelim (yağmur damlası gibi)
    const shortFragments = [
      "=>", "{}", "[]", "()", ";", "==", "===", "!=", "!==", "&&", "||",
      "++", "--", "+=", "-=", "*=", "/=", "%=", "?", ":", "...", "!",
      "true", "false", "null", "undefined", "this", "super", "new", "class",
      "const", "let", "var", "function", "return", "if", "else", "for", "while"
    ];
    
    // Tüm parçaları birleştir
    const allFragments = [...codeFragments, ...shortFragments];
    
    // Aktif kod parçaları
    const activeElements = [];
    const maxElements = 30;
    
    // Yeni bir kod parçası oluştur
    function createCodeElement() {
      if (activeElements.length >= maxElements) return;
      
      // p ihtimalle kısa parça, 0 ihtimalle uzun parça seç
      const text = Math.random() < 0.7
        ? shortFragments[Math.floor(Math.random() * shortFragments.length)]
        : codeFragments[Math.floor(Math.random() * codeFragments.length)];
      
      // Yeni element oluştur
      const element = document.createElement('div');
      element.textContent = text;
      element.style.position = 'absolute';
      element.style.fontFamily = 'monospace';
      element.style.fontSize = `${Math.random() < 0.3 ? 12 : 14}px`;
      
      // Yeşil tonları
      const greenIntensity = 180 + Math.floor(Math.random() * 75);
      element.style.color = `rgb(0, ${greenIntensity}, 0)`;
      
      // Opaklık
      element.style.opacity = (0.4 + Math.random() * 0.6).toString();
      
      // Başlangıç pozisyonu
      const x = Math.random() * (window.innerWidth / 2 - 200) + 20;
      const y = -50 - Math.random() * 100; // Ekranın üstünden başla
      
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      
      // Düşme hızı
      const speed = 0.5 + Math.random() * 3;
      
      // Container'a ekle
      container.appendChild(element);
      
      // Element bilgilerini sakla
      const elementInfo = {
        element,
        y,
        speed
      };
      
      activeElements.push(elementInfo);
    }
    
    // İlk kod parçalarını oluştur
    for (let i = 0; i < maxElements / 2; i++) {
      createCodeElement();
    }
    
    // Animasyon fonksiyonu
    function animateElements() {
      for (let i = 0; i < activeElements.length; i++) {
        const elementInfo = activeElements[i];
        
        // Pozisyonu güncelle
        elementInfo.y += elementInfo.speed;
        elementInfo.element.style.top = `${elementInfo.y}px`;
        
        // Ekranın altına ulaşınca kaldır
        if (elementInfo.y > window.innerHeight + 50) {
          container.removeChild(elementInfo.element);
          activeElements.splice(i, 1);
          i--;
          
          // Yeni bir element ekle
          createCodeElement();
        }
      }
      
      // Rastgele yeni kod parçaları ekle
      if (Math.random() < 0.1 && activeElements.length < maxElements) {
        createCodeElement();
      }
    }
    
    const interval = setInterval(animateElements, 30);
    
    const handleResize = () => {
      // Mevcut elementleri temizle
      activeElements.forEach(info => {
        container.removeChild(info.element);
      });
      activeElements.length = 0;
      
      // Yeni elementler oluştur
      for (let i = 0; i < maxElements / 2; i++) {
        createCodeElement();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      
      // Tüm elementleri temizle
      activeElements.forEach(info => {
        if (container.contains(info.element)) {
          container.removeChild(info.element);
        }
      });
    };
  }, []);
  
  return (
    <>
      <canvas
        ref={matrixCanvasRef}
        className="fixed top-0 left-0 w-1/2 h-full -z-10"
      />
      <div
        ref={codeSnippetsContainerRef}
        className="fixed top-0 right-0 w-1/2 h-full -z-10 overflow-hidden"
        style={{ backgroundColor: 'black' }} // Sağ taraf için siyah arka plan
      />
    </>
  );
}