'use client';
import { useEffect, useState, useRef } from 'react';

export default function SecretPage({
  returnUrl = '/',
  secretCode = "X72B-19F3-QR55-ZT01",
  accessLevel = 5,
  serverLocation = "41.40338, 2.17403",
  onReturn = () => {}, // <<< Buraya onReturn fonksiyonunu alıyoruz
}) {
  const [terminalText, setTerminalText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logMessages, setLogMessages] = useState([]);
  const logRef = useRef(null);

  // Terminal yazı efekti, ilerleme çubuğu ve log
  useEffect(() => {
    const steps = [
      { text: "> BAĞLANTI KURULUYOR...", duration: 1000, log: "İletişim kanalı açıldı.", progress: 10 },
      { text: "> GÜVENLİK DUVARI AŞILIYOR...", duration: 1500, log: "Güvenlik protokolleri bypass edildi.", progress: 30 },
      { text: "> KÖK ERİŞİMİ ELDE EDİLİYOR...", duration: 2000, log: "Yönetici hakları kazanıldı.", progress: 60 },
      { text: "> SİSTEM TAMAMEN HACKLENDİ", duration: 1000, log: "Sistem kontrolü ele geçirildi.", progress: 80 },
      { text: "> ERİŞİM SAĞLANDI", duration: 500, log: "Veri tabanına bağlantı kuruldu.", progress: 90 },
      { text: "> GİZLİ VERİLER ÇÖZÜLÜYOR...", duration: 1500, log: "Şifreleme anahtarları çözüldü.", progress: 95 },
      { text: "> TAMAMLANDI!", duration: 500, log: "Gizli verilere erişim sağlandı.", progress: 100 }
    ];

    let currentStep = 0;
    let currentText = '';
    let charIndex = 0;
    let stepTimeout;
    let charInterval;

    const addLog = (msg) => {
      setLogMessages(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]); // Son 10 logu tut
    };

    const runStep = () => {
      if (currentStep >= steps.length) {
        setTimeout(() => setShowContent(true), 1000);
        return;
      }

      const step = steps[currentStep];
      currentText = '';
      charIndex = 0;
      addLog(step.log);
      setProgress(step.progress);

      charInterval = setInterval(() => {
        currentText = step.text.substring(0, charIndex);
        setTerminalText(currentText);
        charIndex++;
        if (charIndex > step.text.length) {
          clearInterval(charInterval);
          currentStep++;
          stepTimeout = setTimeout(runStep, 500); // Adımlar arası kısa bekleme
        }
      }, 50); // Yazma hızı
    };

    runStep(); // İlk adımı başlat

    return () => {
      clearTimeout(stepTimeout);
      clearInterval(charInterval);
    };
  }, []);

  // Log alanı otomatik aşağı kaydırma
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logMessages]);

  // Kod yağmuru efekti
  useEffect(() => {
    const cleanup = () => {
      document.querySelectorAll('.matrix-code').forEach(el => el.remove());
      document.querySelectorAll('.matrix-style').forEach(el => el.remove());
    };
    
    const style = document.createElement('style');
    style.className = 'matrix-style';
    style.textContent = `
      @keyframes fall {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      
      @keyframes blink {
        0%, 100% { background-color: rgba(255, 0, 0, 0); }
        50% { background-color: rgba(255, 0, 0, 0.3); }
      }
      
      /* Daha yoğun ve rastgele glitch efekti */
      @keyframes glitch {
        2%, 64% { transform: translate(2px, -2px) skew(0.8deg); }
        4%, 60% { transform: translate(-2px, 2px) skew(-0.8deg); }
        62% { transform: translate(0, 0) skew(0); }
        0%, 100% { transform: translate(0, 0) skew(0); clip-path: inset(50% 0 50% 0); }
        5% { clip-path: inset(10% 0 80% 0); }
        10% { clip-path: inset(90% 0 5% 0); }
        15% { clip-path: inset(40% 0 40% 0); }
        20% { clip-path: inset(70% 0 10% 0); }
        25% { clip-path: inset(20% 0 75% 0); }
        30% { clip-path: inset(95% 0 2% 0); }
        35% { clip-path: inset(60% 0 30% 0); }
        40% { clip-path: inset(33% 0 58% 0); }
        45% { clip-path: inset(80% 0 5% 0); }
        50% { clip-path: inset(15% 0 65% 0); }
        55% { clip-path: inset(55% 0 35% 0); }
        60% { clip-path: inset(25% 0 70% 0); }
      }

      /* Veri titreme efekti */
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
        25%, 75% { opacity: 0.95; }
      }
      
      .alarm {
        animation: blink 0.5s infinite;
      }
      
      .glitch {
        /* Animasyon süresini ve zamanlamasını ayarlayalım */
        animation: glitch 1s infinite steps(2, jump-none);
      }

      .data-flicker {
        animation: flicker 0.2s infinite alternate;
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'matrix-code fixed inset-0 z-0 overflow-hidden pointer-events-none';
    document.body.appendChild(container);
    
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+~`|}{[]\\:;?><,./-=";
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div');
      column.className = 'absolute top-0 text-green-500 text-opacity-70 font-mono text-lg';
      column.style.left = `${i * 20}px`;
      column.style.animationDelay = `${Math.random() * 2}s`;
      column.style.animation = `fall ${2 + Math.random() * 3}s linear infinite`;
      
      const columnLength = 10 + Math.floor(Math.random() * 15);
      for (let j = 0; j < columnLength; j++) {
        const char = document.createElement('div');
        char.textContent = characters[Math.floor(Math.random() * characters.length)];
        char.style.opacity = j === 0 ? '1' : `${1 - j / columnLength}`;
        column.appendChild(char);
        
        setInterval(() => {
          if (Math.random() > 0.9) {
            char.textContent = characters[Math.floor(Math.random() * characters.length)];
          }
        }, 300);
      }
      
      container.appendChild(column);
    }
    
    return cleanup;
  }, []);

  // Geri dönüş butonu
  const handleReturn = () => {
    onReturn(); // Ana sayfaya dönüş için onReturn fonksiyonunu çağırıyoruz
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="alarm fixed inset-0 z-0"></div>
      
      <div className="z-10 text-center p-8 bg-black bg-opacity-80 rounded-lg border border-green-500 shadow-lg shadow-green-500/50 max-w-2xl w-full">
        <div className="mb-8 text-left font-mono bg-black p-4 border border-green-500 rounded">
          <pre className="text-green-500 whitespace-pre-wrap">{terminalText}</pre> {/* whitespace-pre-wrap eklendi */}
        </div>

        {/* İlerleme Çubuğu */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-6 border border-green-500">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Sistem Günlüğü */}
        <div
          ref={logRef}
          className="h-32 overflow-y-auto bg-gray-900 p-3 border border-gray-600 rounded mb-8 text-left font-mono text-sm text-gray-400"
        >
          {logMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        
        {showContent && (
          <>
            <h1 className="data-flicker text-4xl font-bold mb-6 text-red-500">GİZLİ SAYFAYA ERİŞİM SAĞLANDI</h1> {/* data-flicker class added */}
            <div className="space-y-6 mb-8">
              <p className="text-xl">Tebrikler! Sistemi başarıyla hacklediniz ve gizli verilere erişim sağladınız.</p>
              <div className="p-4 bg-red-900 bg-opacity-30 border border-red-500 rounded-md">
                <h2 className="text-2xl font-bold mb-2 text-red-400">⚠️ UYARI ⚠️</h2>
                <p>Bu sayfadaki bilgiler son derece gizlidir. Yetkisiz erişim tespit edildi ve IP adresiniz kaydedildi.</p>
              </div>
              {/* data-flicker sınıfı eklendi */}
              <div className="data-flicker p-4 bg-gray-900 border border-gray-700 rounded-md text-left font-mono">
                <p className="mb-2 text-gray-400">// Gizli Veriler:</p>
                <p className="text-yellow-400">const <span className="text-blue-400">secretCode</span> = <span className="text-green-400">"{secretCode}"</span>;</p>
                <p className="text-yellow-400">const <span className="text-blue-400">accessLevel</span> = <span className="text-purple-400">{accessLevel}</span>;</p>
                <p className="text-yellow-400">const <span className="text-blue-400">serverLocation</span> = <span className="text-green-400">"{serverLocation}"</span>;</p>
              </div>
            </div>
            <button 
              onClick={handleReturn}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors mt-4"
            >
              Ana Sayfaya Dön
            </button>
          </>
        )}
      </div>
    </div>
  );
}
