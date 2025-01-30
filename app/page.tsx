"use client"

import React, { useState, useEffect, useRef } from 'react';

// Separate client-only component for interactive elements
const InteractiveBubble = () => {
  const interBubbleRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
      if (!interBubbleRef.current) return;

      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      interBubbleRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      animationFrameRef.current = requestAnimationFrame(move);
    };

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(move);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <div ref={interBubbleRef} className="interactive" />;
};

// Background SVG component
const BackgroundSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
          result="goo"
        />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  </svg>
);

// Client-side only wrapper component
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
};

const italianQuotes = [
  "La vita è ciò che ti accade mentre sei occupato a fare altri progetti.",
  "Il futuro appartiene a coloro che credono nella bellezza dei propri sogni.",
  "Sii il cambiamento che vuoi vedere nel mondo.",
  "La creatività è l'intelligenza che si diverte.",
  "La felicità non è qualcosa di già pronto. Nasce dalle tue azioni.",
  "Il modo di cominciare è smettere di parlare e iniziare a fare.",
  "La misura dell'intelligenza è data dalla capacità di cambiare quando è necessario.",
  "Non contano i passi che fai, ma le impronte che lasci.",
  "La vita è un'opportunità, coglila.",
  "Insegui i tuoi sogni."
];

const MotivationPage = () => {
  const [quote] = useState(() =>
    italianQuotes[Math.floor(Math.random() * italianQuotes.length)]
  )

  return (
    <ClientOnly>
      <div className="min-h-screen w-full relative overflow-hidden">
      <div className="gradient-bg">
        <BackgroundSVG />
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <ClientOnly>
            <InteractiveBubble />
          </ClientOnly>
        </div>
      </div>

      <nav className="absolute z-20 flex justify-center items-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-lg w-[90%] md:w-3/2 my-8 rounded-xl border-3 border-white/20 left-1/2 transform -translate-x-1/2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex-shrink-0">
              <span className="text-white/60 text-2xl font-semibold">EchoWords</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center">{quote}</h1>
      </div>
    </div>
    </ClientOnly>
  );
};

export default MotivationPage;