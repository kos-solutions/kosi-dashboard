import Header from "./components/Header";
import { DashboardProvider } from "@/lib/DashboardContext"; // ⭐ Importă Provider-ul

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider> {/* ⭐ Împachetează totul aici */}
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </DashboardProvider>
  );
}