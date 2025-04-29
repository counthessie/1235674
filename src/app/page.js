'use client';
import { useState } from 'react';
import CodeBackground from './components/CodeBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Footer from './components/Footer';
import HackButton from './components/HackButton';
import SecretPage from './components/SecretPage'; // Bunu da ekle!

export default function Home() {
  const [hacked, setHacked] = useState(false);

  if (hacked) {
    // Hacklendiğinde SecretPage gözükecek
    return (
      <SecretPage
        returnUrl="/"
        secretCode="TR-HACK-2023"
        accessLevel={9}
        serverLocation="39.9334, 32.8597"
        onReturn={() => setHacked(false)} // <<< Burada hacked'i sıfırlıyoruz
      />
    );
  }

  return (
    <main>
      <CodeBackground />
      <Header />
      <Hero />
      <Projects />
      
      {/* Hack butonu */}
      <div className="flex justify-center my-8">
        <HackButton 
          hackDelay={5000}
          secretCode="TR-HACK-2023"
          accessLevel={9}
          serverLocation="39.9334, 32.8597"
          returnUrl="/"
          variant="secondary"
          className="text-lg"
          onHackSuccess={() => setHacked(true)} // Hacklendiğinde setHacked(true) olacak
        >
          Sistemi Hackle
        </HackButton>
      </div>
      
      <Footer />
    </main>
  );
}
