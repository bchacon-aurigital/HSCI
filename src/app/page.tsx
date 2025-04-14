// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LoadingScreen from '@/components/LoadingScreen';
import FirebaseMonitor from '@/components/firebase-monitor';
import WaterSystemColumns from '@/components/ui/WaterSystemColumns';
import DepuradorSistemaAgua from '@/components/WaterSystemDebugger';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900">
      {isLoading && <LoadingScreen />}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="container mx-auto">
          <WaterSystemColumns />
          {/* Asegúrate de que DepuradorSistemaAgua se renderice aquí */}
          <DepuradorSistemaAgua />
        </div>
        <footer className="fixed bottom-0 w-full h-5 bg-[#061120]">
          <a
            href="https://aurigital.com"
            target="_blank"
            className="flex justify-center mx-auto w-full"
          >
            <p className="text-white uppercase text-[8px] text-center p-1 hover:text-[#28C0F5] ">
              Design and Development by :
            </p>
            <Image
              src="/isotipo.avif"
              alt="Design and Development by aurigital"
              width={20}
              height={20}
              className="h-[20px] w-[20px]"
            />
          </a>
        </footer>
      </div>
    </main>
  );
}