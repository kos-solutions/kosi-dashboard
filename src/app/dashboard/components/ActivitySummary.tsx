export default function ActivitySummary() {
  const summary = {
    totalMinutes: 32,
    sessionsCount: 3,
    alertsToday: 0,
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Activitate – Astăzi</h3>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-semibold">{summary.totalMinutes}</p>
          <p className="text-sm text-gray-500">minute</p>
        </div>

        <div>
          <p className="text-2xl font-semibold">{summary.sessionsCount}</p>
          <p className="text-sm text-gray-500">sesiuni</p>
        </div>

        <div>
          <p
            className={`text-2xl font-semibold ${
              summary.alertsToday > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {summary.alertsToday}
          </p>
          <p className="text-sm text-gray-500">alerte</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {summary.alertsToday === 0
          ? "Zi liniștită, fără evenimente sensibile."
          : "Au existat evenimente care au necesitat atenție."}
      </div>
    </div>
  );
}
