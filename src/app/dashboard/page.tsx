import StatusCard from "./components/StatusCard";
import QuickControls from "./components/QuickControls";
import Insights from "./components/Insights";
import DeviceStatus from "./components/DeviceStatus";
import ActivitySummary from "./components/ActivitySummary";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <StatusCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickControls />
          <Insights />
        </div>
      </div>

      <div className="space-y-6">
        <DeviceStatus />
        <ActivitySummary />
      </div>
    </div>
  );
}
