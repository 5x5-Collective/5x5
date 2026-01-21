import AnimatedGrid from '../components/ui/AnimatedGrid';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-7xl mx-auto px-4">
        <AnimatedGrid useTurrellDots={true} />
      </div>
    </main>
  );
}
