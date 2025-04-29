// app/components/HackButton.jsx
'use client';
import { useState } from 'react';

export default function HackButton({ hackDelay, onHackSuccess, children, secretCode, accessLevel, serverLocation, returnUrl, ...props }) {
  const [isHacked, setIsHacked] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading durumu ekledik.

  const handleClick = () => {
    setLoading(true);  // Butonun tıklandığını belirtiyoruz.
    setTimeout(() => {
      setIsHacked(true); // Hack tamamlandı
      onHackSuccess();   // Callback fonksiyonu çağırıyoruz
    }, 1000);  // Hack işlemi 1 saniye sonra başarılı olacak
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={loading}  // Buton tıklanamaz hale gelir
      className={`px-6 py-3 ${loading ? 'bg-green-500' : 'bg-blue-500'} text-white font-bold rounded-md transition-colors`}
    >
      {loading ? 'Sistemi Hackliyorum...' : children}
    </button>
  );
}
