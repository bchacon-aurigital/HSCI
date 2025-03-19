// src/app/page.tsx
import FirebaseMonitor from '@/components/firebase-monitor';
import WaterSystemColumns from '@/components/ui/WaterSystemColumns';


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1729] to-[#21314e]">
      <div className="container mx-auto">
        <WaterSystemColumns />
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
          <img
            src="/isotipo.avif"
            alt="Design and Development by aurigital"
            className="h-[20px] w-[20px]"
          />
        </a>
      </footer>
    </main>
  );
}