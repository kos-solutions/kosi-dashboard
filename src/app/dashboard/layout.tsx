import { DashboardProvider } from "@/lib/DashboardContext";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Navigația laterală fixă */}
        <Sidebar />
        
        {/* Zona principală de conținut */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 py-10 lg:px-12">
            {children}
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}