"use client"

import { createClient } from '@/utils/supabase/client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Variants from '../components/options';
import { Share } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useDeviceDetection } from '@/utils/device-detection';

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

const MotivationContent = () => {
  const [quote, setQuote] = useState<string>("Caricamento...");
  const [quoteId, setQuoteId] = useState<number | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchQuote = async () => {
      const supabase = createClient();
      const id = searchParams.get('id');

      if (id) {
        // Fetch specific quote if ID is provided
        const { data, error } = await supabase
          .from("phrases")
          .select("id, phrase")
          .eq('id', id)
          .single();

        if (error || !data) {
          console.error("Error fetching quote:", error?.message);
          setQuote("Errore nel caricamento della frase.");
          // Fallback to random quote if ID not found
          fetchRandomQuote();
        } else {
          setQuote(data.phrase);
          setQuoteId(data.id);
        }
      } else {
        fetchRandomQuote();
      }
    };

    const fetchRandomQuote = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("phrases")
        .select("id, phrase");

      if (error) {
        console.error("Error fetching quote:", error.message);
        setQuote("Errore nel caricamento della frase.");
      } else if (data) {
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        setQuote(randomQuote.phrase);
        setQuoteId(randomQuote.id);
      }
    };

    fetchQuote();
  }, [searchParams, router]);

  const handleShare = async () => {
    if (!quoteId) return;

    const url = `${window.location.origin}?id=${quoteId}`;
    await navigator.clipboard.writeText(url);
    toast.success('Link copiato con successo')
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 4500);
  };

  const isMobile = useDeviceDetection()

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="gradient-bg">
        <BackgroundSVG />
        <div className={isMobile ? "gradients-container" : "gradients-container-desktop"}>
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

      <Variants />
      <button
        onClick={handleShare}
        className={"m-4 flex justify-center items-center w-[50px] h-[50px] rounded-full fixed bottom-4 right-4 z-50 text-white/80 bg-white/20 backdrop-filter backdrop-blur-lg shadow-xl border-2 border-white/20 hover:scale-110 transition-all " + (showCopied ? "hidden" : "")}        title="Copy link to clipboard"
      >
        <Share />
      </button>
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 text-center">
          {quote}
        </h1>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const MotivationPage = () => {
  return (
    <ClientOnly>
      <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
          <div className="text-xl font-bold text-white/80">Caricamento...</div>
        </div>
      }>
        <MotivationContent />
      </Suspense>
    </ClientOnly>
  );
};

export default MotivationPage;