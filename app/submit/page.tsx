"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

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

const SubmitPage = () => {
  const router = useRouter();
  const [phrase, setPhrase] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phrase.trim() || !userName.trim()) {
      toast.error('Per favore compila tutti i campi');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('users_phrases')
        .insert([
          { phrase: phrase.trim(), user_name: userName.trim() }
        ]);

      if (error) throw error;

      toast.success('Frase inviata con successo!');
      setPhrase('');
      setUserName('');
    } catch (error) {
      toast.error('Errore durante l\'invio della frase');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Condividi la Tua Frase
        </h1>
        <p className="text-lg sm:text-xl text-white/80 text-center mb-8 max-w-2xl backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/10">
          Condividi con noi quella frase speciale che ti ha ispirato o motivato nella tua vita.
          La tua frase potrebbe essere esattamente ciò di cui qualcun altro ha bisogno oggi.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 backdrop-blur-sm bg-white/20 p-8 rounded-xl border-2 border-white/20">
          <div>
            <label htmlFor="userName" className="block text-lg text-white/90 mb-2">
              Il Tuo Nome
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              placeholder="Inserisci il tuo nome"
            />
          </div>
          <div>
            <label htmlFor="phrase" className="block text-lg text-white/90 mb-2">
              La Tua Frase
            </label>
            <textarea
              id="phrase"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 min-h-[100px]"
              placeholder="Scrivi qui la tua frase motivazionale..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg bg-white/20 text-white font-bold hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia la tua frase'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPage; 