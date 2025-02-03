"use client"

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

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

const AboutPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="gradient-bg">
        <BackgroundSVG />
        <div className="gradients-container-desktop">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <InteractiveBubble />
        </div>
      </div>

      <button
        onClick={() => router.push('/')}
        className="m-4 flex justify-center items-center w-[50px] h-[50px] rounded-full fixed top-4 left-4 z-50 text-white/80 bg-white/20 backdrop-filter backdrop-blur-lg shadow-xl border-2 border-white/20 hover:scale-110 transition-all"      >
        <ArrowLeft />
      </button>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white/90 text-center mb-8">
          Chi Siamo
        </h1>
        <div className="text-lg sm:text-xl text-white/80 space-y-6 backdrop-blur-sm bg-white/20 p-8 rounded-xl border-2 border-white/20">
          <p>
            Ciao! Siamo Matteo, Martina, Alessia, Marco e Cristina, degli allievi della Soft Skills Academy di Lecce
            e la nostra missione è semplice: vogliamo aiutare le persone a trovare
            la motivazione quotidiana di cui hanno bisogno per perseguire i loro sogni
            e superare le sfide della vita.
          </p>
          <p>
            Crediamo nel potere delle parole e nella loro capacità di trasformare
            prospettive e ispirare azioni positive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;