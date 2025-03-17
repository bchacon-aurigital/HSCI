// src/app/page.tsx
import FirebaseMonitor from '@/components/firebase-monitor';
import WaterSystemColumns from '@/components/ui/WaterSystemColumns';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-5xl py-24 text-center mx-auto">Sistema de monitoreo remoto de: ASADA Los Sueños</h1>
      <div className="container mx-auto">
        <WaterSystemColumns />
      </div>
    </main>
  );
}