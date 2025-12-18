export default function StatusCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-2">
        Andrei – Status
      </h2>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">KOSI device</p>
          <p className="text-green-600 font-medium">Online</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Stare emoțională</p>
          <p className="font-medium">Calm 😊</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Ultima activitate: acum 12 minute
      </p>
    </div>
  );
}
