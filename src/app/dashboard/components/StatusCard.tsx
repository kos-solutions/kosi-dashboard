export default function StatusCard() {
  const child = {
    name: "Andrei",
    status: "online",
    emotion: "calm",
    lastActivity: "acum 12 minute",
    lastSession: "Poveste (8 min)",
    alert: null, // sau string
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{child.name}</h2>
        <span className="text-sm text-green-600">
          {child.status === "online" ? "Online" : "Offline"}
        </span>
      </div>

      {/* Emotion */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Stare emoțională</p>
        <p className="text-lg">
          {child.emotion === "calm" && "Calm 😊"}
          {child.emotion === "neutral" && "Neutru 😐"}
          {child.emotion === "agitated" && "Agitat 😟"}
        </p>
      </div>

      {/* Activity */}
      <div className="mb-4 text-sm text-gray-600">
        <p>Ultima activitate: {child.lastActivity}</p>
        <p>Ultima sesiune: {child.lastSession}</p>
      </div>

      {/* Alert */}
      <div className="text-sm">
        {child.alert ? (
          <p className="text-red-600">⚠️ {child.alert}</p>
        ) : (
          <p className="text-green-600">Nu sunt alerte active</p>
        )}
      </div>
    </div>
  );
}
