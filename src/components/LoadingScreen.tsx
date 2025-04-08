'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0b1729] to-[#21314e] z-50 flex flex-col items-center justify-center">
      <div className="animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-16 text-[#28C0F5]" viewBox="0 0 24 24">
          <path
            d="M12 2.69c-.23 0-.42.09-.59.21C9.97 4.22 4 9.08 4 15.5 4 19.58 7.42 23 12 23s8-3.42 8-7.5c0-6.42-5.97-11.28-7.41-12.6-.17-.12-.36-.21-.59-.21z"
            fill="currentColor"
            stroke="currentColor"
          />
        </svg>
      </div>
      <div className="w-48 h-1 bg-[#061120] rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-[#28C0F5] rounded-full animate-progress-bar"></div>
      </div>
    </div>
  );
} 