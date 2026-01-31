import OngPublicProfile from "@/components/specific/Ong-Public-Profile/ong-public-profile";
import { ongs } from "@/data/ongs";

export function generateStaticParams() {
  return ongs.map((ong) => ({ id: String(ong.id) }));
}

export default async function OngPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const ongId = Number(id);
  const ong = ongs.find((o) => o.id === ongId);

  if (!ong) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ONG não encontrada</h1>
          <p className="mt-2 text-gray-500">ID: {id}</p>
        </div>
      </div>
    );
  }

  return <OngPublicProfile ong={ong} />;
}
