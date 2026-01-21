import AnimatedGrid from "../../components/ui/AnimatedGrid";

export default function SubscribePage() {
  // Pass the "subscribe" slug to AnimatedGrid for special handling
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-7xl mx-auto px-4">
        <AnimatedGrid slug="subscribe" useTurrellDots={true} />
      </div>
    </main>
  );
}
