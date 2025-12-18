import { DashboardProvider } from "@/lib/DashboardContext";
import Header from "./components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </DashboardProvider>
  );
}
