import StatusCard from "./components/StatusCard";
import QuickControls from "./components/QuickControls";
import ActivitySummary from "./components/ActivitySummary";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StatusCard />
      <QuickControls />
      <ActivitySummary />
    </div>
  );
}
