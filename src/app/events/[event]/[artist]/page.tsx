import AnimatedGrid from "../../../../components/ui/AnimatedGrid";

interface Params {
  params: { event: string; artist: string };
}

export default function EventArtistPage({ params }: Params) {
  // Pass the artist slug directly to AnimatedGrid for artist highlighting
  const slug = params.artist || null;
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-7xl mx-auto px-4">
        <AnimatedGrid slug={slug} useTurrellDots={true} />
      </div>
    </main>
  );
}
