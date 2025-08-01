// components/WelcomeSplash.tsx

export function WelcomeSplash() {
  return (
    <div className="text-center mt-20 p-8 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-4xl font-semibold text-white">Willkommen</h2>
      <p className="text-gray-300 mt-4 text-lg">
        Bitte verbinde deine Wallet, um das Dashboard zu sehen und mit dem Projekt zu interagieren.
      </p>
    </div>
  );
}