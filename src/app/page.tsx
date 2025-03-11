// src/app/page.tsx
import FirebaseMonitor from '@/components/firebase-monitor';
import WaterTankGrid from '@/components/ui/WaterTankGrid';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto">
        <WaterTankGrid />
      </div>
    </main>
  );
}