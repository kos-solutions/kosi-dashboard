import { DashboardProvider } from "@/lib/DashboardContext";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      {/* Schimbare critică: flex-col pe mobil, flex-row pe ecrane medii+ */}
      <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
        
        {/* Sidebar-ul: Pe mobil îl poți ascunde (hidden) sau lăsa sus. 
            Recomandare rapidă: Ascunde-l pe mobil momentan dacă nu ai meniu hamburger, 
            sau lasă-l 'w-full' pe mobil.
            Aici îl fac vizibil doar pe Desktop (md:block) pentru a curăța ecranul mobil. 
        */}
        <div className="hidden md:block md:w-64 flex-shrink-0">
            <Sidebar />
        </div>

        {/* Zona principală de conținut */}
        <main className="flex-1 overflow-y-auto w-full">
          {/* Padding dinamic: px-4 pe mobil, px-12 pe PC */}
          <div className="w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}